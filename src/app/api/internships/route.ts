import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { internships } from '@/db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single internship by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const internship = await db.select()
        .from(internships)
        .where(eq(internships.id, parseInt(id)))
        .limit(1);

      if (internship.length === 0) {
        return NextResponse.json({ 
          error: 'Internship not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(internship[0], { status: 200 });
    }

    // List internships with filters
    if (!userId) {
      return NextResponse.json({ 
        error: "userId query parameter is required for listing internships",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    let query = db.select().from(internships);

    // Apply userId filter
    let conditions = [eq(internships.userId, parseInt(userId))];

    // Apply search filter
    if (search) {
      const searchCondition = or(
        like(internships.company, `%${search}%`),
        like(internships.position, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    query = query.where(and(...conditions));

    // Apply ordering, pagination
    const results = await query
      .orderBy(desc(internships.startDate))
      .limit(limit)
      .offset(offset);

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
    const { userId, company, position, startDate, endDate, current, description, skillsUsed, location } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (!company || company.trim() === '') {
      return NextResponse.json({ 
        error: "company is required and cannot be empty",
        code: "MISSING_COMPANY" 
      }, { status: 400 });
    }

    if (!position || position.trim() === '') {
      return NextResponse.json({ 
        error: "position is required and cannot be empty",
        code: "MISSING_POSITION" 
      }, { status: 400 });
    }

    if (!startDate || startDate.trim() === '') {
      return NextResponse.json({ 
        error: "startDate is required and cannot be empty",
        code: "MISSING_START_DATE" 
      }, { status: 400 });
    }

    // Validate current field if provided
    if (current !== undefined && typeof current !== 'boolean') {
      return NextResponse.json({ 
        error: "current must be a boolean value",
        code: "INVALID_CURRENT" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData: any = {
      userId: parseInt(userId),
      company: company.trim(),
      position: position.trim(),
      startDate: startDate.trim(),
      current: current ?? false,
      createdAt: new Date().toISOString()
    };

    // Add optional fields
    if (endDate !== undefined && endDate !== null) {
      insertData.endDate = endDate.trim();
    }

    if (description !== undefined && description !== null) {
      insertData.description = description.trim();
    }

    if (skillsUsed !== undefined && skillsUsed !== null) {
      insertData.skillsUsed = skillsUsed.trim();
    }

    if (location !== undefined && location !== null) {
      insertData.location = location.trim();
    }

    const newInternship = await db.insert(internships)
      .values(insertData)
      .returning();

    return NextResponse.json(newInternship[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "ID is required",
        code: "MISSING_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if internship exists
    const existing = await db.select()
      .from(internships)
      .where(eq(internships.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Internship not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const { company, position, startDate, endDate, current, description, skillsUsed, location } = body;

    // Validate fields if provided
    if (company !== undefined && company.trim() === '') {
      return NextResponse.json({ 
        error: "company cannot be empty",
        code: "INVALID_COMPANY" 
      }, { status: 400 });
    }

    if (position !== undefined && position.trim() === '') {
      return NextResponse.json({ 
        error: "position cannot be empty",
        code: "INVALID_POSITION" 
      }, { status: 400 });
    }

    if (startDate !== undefined && startDate.trim() === '') {
      return NextResponse.json({ 
        error: "startDate cannot be empty",
        code: "INVALID_START_DATE" 
      }, { status: 400 });
    }

    if (current !== undefined && typeof current !== 'boolean') {
      return NextResponse.json({ 
        error: "current must be a boolean value",
        code: "INVALID_CURRENT" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};

    if (company !== undefined) {
      updateData.company = company.trim();
    }

    if (position !== undefined) {
      updateData.position = position.trim();
    }

    if (startDate !== undefined) {
      updateData.startDate = startDate.trim();
    }

    if (endDate !== undefined) {
      updateData.endDate = endDate === null ? null : endDate.trim();
    }

    if (current !== undefined) {
      updateData.current = current;
    }

    if (description !== undefined) {
      updateData.description = description === null ? null : description.trim();
    }

    if (skillsUsed !== undefined) {
      updateData.skillsUsed = skillsUsed === null ? null : skillsUsed.trim();
    }

    if (location !== undefined) {
      updateData.location = location === null ? null : location.trim();
    }

    const updated = await db.update(internships)
      .set(updateData)
      .where(eq(internships.id, parseInt(id)))
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "ID is required",
        code: "MISSING_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if internship exists
    const existing = await db.select()
      .from(internships)
      .where(eq(internships.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Internship not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(internships)
      .where(eq(internships.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Internship deleted successfully',
      internship: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}