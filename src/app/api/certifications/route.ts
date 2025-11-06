import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq, asc, desc, and, or, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resumeId = searchParams.get('resumeId');
    const userId = searchParams.get('userId');

    // Single certification by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const certification = await db.select()
        .from(certifications)
        .where(eq(certifications.id, parseInt(id)))
        .limit(1);

      if (certification.length === 0) {
        return NextResponse.json({ 
          error: 'Certification not found',
          code: "CERTIFICATION_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(certification[0], { status: 200 });
    }

    // List certifications - require either resumeId or userId
    if (!resumeId && !userId) {
      return NextResponse.json({ 
        error: "Either resumeId or userId parameter is required",
        code: "MISSING_REQUIRED_PARAMETER" 
      }, { status: 400 });
    }

    let query = db.select().from(certifications);

    // Filter by resumeId or userId
    if (resumeId && userId) {
      if (isNaN(parseInt(resumeId)) || isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid resumeId and userId are required",
          code: "INVALID_PARAMETERS" 
        }, { status: 400 });
      }
      query = query.where(
        and(
          eq(certifications.resumeId, parseInt(resumeId)),
          eq(certifications.userId, parseInt(userId))
        )
      );
    } else if (resumeId) {
      if (isNaN(parseInt(resumeId))) {
        return NextResponse.json({ 
          error: "Valid resumeId is required",
          code: "INVALID_RESUME_ID" 
        }, { status: 400 });
      }
      query = query.where(eq(certifications.resumeId, parseInt(resumeId)));
    } else if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      query = query.where(eq(certifications.userId, parseInt(userId)));
    }

    // Order by orderIndex ASC, then date DESC (nulls last)
    const results = await query
      .orderBy(
        asc(certifications.orderIndex),
        sql`CASE WHEN ${certifications.date} IS NULL THEN 1 ELSE 0 END`,
        desc(certifications.date)
      );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId, userId, name, issuer, date, credentialUrl, orderIndex } = body;

    // Validate required fields
    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json({ 
        error: "Valid resumeId is required",
        code: "MISSING_RESUME_ID" 
      }, { status: 400 });
    }

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Validate orderIndex if provided
    if (orderIndex !== undefined && orderIndex !== null && isNaN(parseInt(orderIndex))) {
      return NextResponse.json({ 
        error: "orderIndex must be a valid integer",
        code: "INVALID_ORDER_INDEX" 
      }, { status: 400 });
    }

    // Prepare insert data with defaults
    const insertData: any = {
      resumeId: parseInt(resumeId),
      userId: parseInt(userId),
      name: name.trim(),
      orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0
    };

    // Add optional fields if provided
    if (issuer !== undefined && issuer !== null) {
      insertData.issuer = typeof issuer === 'string' ? issuer.trim() : issuer;
    }

    if (date !== undefined && date !== null) {
      insertData.date = typeof date === 'string' ? date.trim() : date;
    }

    if (credentialUrl !== undefined && credentialUrl !== null) {
      insertData.credentialUrl = typeof credentialUrl === 'string' ? credentialUrl.trim() : credentialUrl;
    }

    const newCertification = await db.insert(certifications)
      .values(insertData)
      .returning();

    return NextResponse.json(newCertification[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { name, issuer, date, credentialUrl, orderIndex } = body;

    // Check if certification exists
    const existing = await db.select()
      .from(certifications)
      .where(eq(certifications.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Certification not found',
        code: "CERTIFICATION_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json({ 
        error: "Name must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (orderIndex !== undefined && orderIndex !== null && isNaN(parseInt(orderIndex))) {
      return NextResponse.json({ 
        error: "orderIndex must be a valid integer",
        code: "INVALID_ORDER_INDEX" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (issuer !== undefined) {
      updateData.issuer = issuer !== null && typeof issuer === 'string' ? issuer.trim() : issuer;
    }

    if (date !== undefined) {
      updateData.date = date !== null && typeof date === 'string' ? date.trim() : date;
    }

    if (credentialUrl !== undefined) {
      updateData.credentialUrl = credentialUrl !== null && typeof credentialUrl === 'string' ? credentialUrl.trim() : credentialUrl;
    }

    if (orderIndex !== undefined) {
      updateData.orderIndex = parseInt(orderIndex);
    }

    const updated = await db.update(certifications)
      .set(updateData)
      .where(eq(certifications.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if certification exists
    const existing = await db.select()
      .from(certifications)
      .where(eq(certifications.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Certification not found',
        code: "CERTIFICATION_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(certifications)
      .where(eq(certifications.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Certification deleted successfully',
      certification: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}