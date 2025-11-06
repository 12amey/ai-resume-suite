import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { education } from '@/db/schema';
import { eq, asc, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const resumeId = searchParams.get('resumeId');

    // Single education by ID
    if (id) {
      const educationId = parseInt(id);
      if (isNaN(educationId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(education)
        .where(eq(education.id, educationId))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Education record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List education by resumeId
    if (!resumeId) {
      return NextResponse.json(
        { error: 'resumeId is required', code: 'MISSING_RESUME_ID' },
        { status: 400 }
      );
    }

    const resumeIdInt = parseInt(resumeId);
    if (isNaN(resumeIdInt)) {
      return NextResponse.json(
        { error: 'Valid resumeId is required', code: 'INVALID_RESUME_ID' },
        { status: 400 }
      );
    }

    const records = await db
      .select()
      .from(education)
      .where(eq(education.resumeId, resumeIdInt))
      .orderBy(
        asc(education.orderIndex),
        sql`CASE WHEN ${education.endDate} IS NULL THEN 1 ELSE 0 END`,
        desc(education.endDate)
      );

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId, school, degree, field, startDate, endDate, grade, orderIndex } = body;

    // Validate required field
    if (!resumeId) {
      return NextResponse.json(
        { error: 'resumeId is required', code: 'MISSING_RESUME_ID' },
        { status: 400 }
      );
    }

    // Validate resumeId is a valid integer
    const resumeIdInt = parseInt(resumeId);
    if (isNaN(resumeIdInt)) {
      return NextResponse.json(
        { error: 'Valid resumeId is required', code: 'INVALID_RESUME_ID' },
        { status: 400 }
      );
    }

    // Validate orderIndex if provided
    let orderIndexValue = 0;
    if (orderIndex !== undefined && orderIndex !== null) {
      orderIndexValue = parseInt(orderIndex);
      if (isNaN(orderIndexValue)) {
        return NextResponse.json(
          { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
    }

    const insertData: any = {
      resumeId: resumeIdInt,
      orderIndex: orderIndexValue,
    };

    // Add optional fields if provided
    if (school !== undefined && school !== null) {
      insertData.school = typeof school === 'string' ? school.trim() : school;
    }
    if (degree !== undefined && degree !== null) {
      insertData.degree = typeof degree === 'string' ? degree.trim() : degree;
    }
    if (field !== undefined && field !== null) {
      insertData.field = typeof field === 'string' ? field.trim() : field;
    }
    if (startDate !== undefined && startDate !== null) {
      insertData.startDate = typeof startDate === 'string' ? startDate.trim() : startDate;
    }
    if (endDate !== undefined && endDate !== null) {
      insertData.endDate = typeof endDate === 'string' ? endDate.trim() : endDate;
    }
    if (grade !== undefined && grade !== null) {
      insertData.grade = typeof grade === 'string' ? grade.trim() : grade;
    }

    const newRecord = await db
      .insert(education)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const educationId = parseInt(id);
    if (isNaN(educationId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(education)
      .where(eq(education.id, educationId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Education record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { school, degree, field, startDate, endDate, grade, orderIndex } = body;

    const updates: any = {};

    // Add updatable fields if provided
    if (school !== undefined) {
      updates.school = typeof school === 'string' && school ? school.trim() : school;
    }
    if (degree !== undefined) {
      updates.degree = typeof degree === 'string' && degree ? degree.trim() : degree;
    }
    if (field !== undefined) {
      updates.field = typeof field === 'string' && field ? field.trim() : field;
    }
    if (startDate !== undefined) {
      updates.startDate = typeof startDate === 'string' && startDate ? startDate.trim() : startDate;
    }
    if (endDate !== undefined) {
      updates.endDate = typeof endDate === 'string' && endDate ? endDate.trim() : endDate;
    }
    if (grade !== undefined) {
      updates.grade = typeof grade === 'string' && grade ? grade.trim() : grade;
    }
    if (orderIndex !== undefined) {
      const orderIndexValue = parseInt(orderIndex);
      if (isNaN(orderIndexValue)) {
        return NextResponse.json(
          { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
      updates.orderIndex = orderIndexValue;
    }

    const updated = await db
      .update(education)
      .set(updates)
      .where(eq(education.id, educationId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const educationId = parseInt(id);
    if (isNaN(educationId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(education)
      .where(eq(education.id, educationId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Education record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(education)
      .where(eq(education.id, educationId))
      .returning();

    return NextResponse.json(
      {
        message: 'Education record deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}