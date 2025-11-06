import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { courses } from '@/db/schema';
import { eq, desc, like, or, and, isNull, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single course by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const course = await db.select()
        .from(courses)
        .where(eq(courses.id, parseInt(id)))
        .limit(1);

      if (course.length === 0) {
        return NextResponse.json({ 
          error: 'Course not found',
          code: "COURSE_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(course[0], { status: 200 });
    }

    // List courses - userId required for list
    if (!userId) {
      return NextResponse.json({ 
        error: "userId parameter is required for listing courses",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    let query = db.select().from(courses).$dynamic();

    // Filter by userId
    let conditions = [eq(courses.userId, parseInt(userId))];

    // Add search condition
    if (search) {
      const searchCondition = or(
        like(courses.name, `%${search}%`),
        like(courses.platform, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    query = query.where(and(...conditions));

    // Order by completionDate DESC (nulls last), then createdAt DESC
    query = query.orderBy(
      sql`CASE WHEN ${courses.completionDate} IS NULL THEN 1 ELSE 0 END`,
      desc(courses.completionDate),
      desc(courses.createdAt)
    );

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

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
    const { 
      userId, 
      name, 
      platform, 
      instructor, 
      completionDate, 
      certificateUrl, 
      skillsLearned, 
      duration 
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (typeof userId !== 'number' && isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      userId: typeof userId === 'number' ? userId : parseInt(userId),
      name: name.trim(),
      platform: platform ? platform.trim() : null,
      instructor: instructor ? instructor.trim() : null,
      completionDate: completionDate ? completionDate.trim() : null,
      certificateUrl: certificateUrl ? certificateUrl.trim() : null,
      skillsLearned: skillsLearned ? skillsLearned.trim() : null,
      duration: duration ? duration.trim() : null,
      createdAt: new Date().toISOString()
    };

    const newCourse = await db.insert(courses)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newCourse[0], { status: 201 });

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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { 
      name, 
      platform, 
      instructor, 
      completionDate, 
      certificateUrl, 
      skillsLearned, 
      duration 
    } = body;

    // Check if course exists
    const existingCourse = await db.select()
      .from(courses)
      .where(eq(courses.id, parseInt(id)))
      .limit(1);

    if (existingCourse.length === 0) {
      return NextResponse.json({ 
        error: 'Course not found',
        code: "COURSE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Build update object with only provided fields
    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ 
          error: "name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (platform !== undefined) {
      updates.platform = platform ? platform.trim() : null;
    }

    if (instructor !== undefined) {
      updates.instructor = instructor ? instructor.trim() : null;
    }

    if (completionDate !== undefined) {
      updates.completionDate = completionDate ? completionDate.trim() : null;
    }

    if (certificateUrl !== undefined) {
      updates.certificateUrl = certificateUrl ? certificateUrl.trim() : null;
    }

    if (skillsLearned !== undefined) {
      updates.skillsLearned = skillsLearned ? skillsLearned.trim() : null;
    }

    if (duration !== undefined) {
      updates.duration = duration ? duration.trim() : null;
    }

    const updated = await db.update(courses)
      .set(updates)
      .where(eq(courses.id, parseInt(id)))
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if course exists
    const existingCourse = await db.select()
      .from(courses)
      .where(eq(courses.id, parseInt(id)))
      .limit(1);

    if (existingCourse.length === 0) {
      return NextResponse.json({ 
        error: 'Course not found',
        code: "COURSE_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(courses)
      .where(eq(courses.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      course: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}