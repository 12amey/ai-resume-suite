import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resumes, users } from '@/db/schema';
import { eq, desc, like, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single resume by ID
    if (id) {
      const resumeId = parseInt(id);
      if (isNaN(resumeId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const resume = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, resumeId))
        .limit(1);

      if (resume.length === 0) {
        return NextResponse.json(
          { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(resume[0], { status: 200 });
    }

    // List all resumes with filters
    let query = db.select().from(resumes);
    const conditions = [];

    // Filter by userId
    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(resumes.userId, userIdInt));
    }

    // Search by name
    if (search) {
      conditions.push(like(resumes.name, `%${search}%`));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by lastUpdated DESC and apply pagination
    const results = await query
      .orderBy(desc(resumes.lastUpdated))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { userId, name, template, thumbnail, atsScore } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'number' || isNaN(userId)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults and auto-generated fields
    const currentTimestamp = new Date().toISOString();
    const insertData = {
      userId,
      name: name.trim(),
      template: template && typeof template === 'string' ? template.trim() : 'modern',
      thumbnail: thumbnail && typeof thumbnail === 'string' ? thumbnail.trim() : null,
      atsScore: atsScore && typeof atsScore === 'number' ? atsScore : null,
      lastUpdated: currentTimestamp,
      createdAt: currentTimestamp,
    };

    const newResume = await db.insert(resumes).values(insertData).returning();

    return NextResponse.json(newResume[0], { status: 201 });
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

    const resumeId = parseInt(id);
    if (isNaN(resumeId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if resume exists
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, template, thumbnail, atsScore } = body;

    // Build update object with only provided fields
    const updates: any = {
      lastUpdated: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (template !== undefined) {
      if (typeof template !== 'string') {
        return NextResponse.json(
          { error: 'template must be a string', code: 'INVALID_TEMPLATE' },
          { status: 400 }
        );
      }
      updates.template = template.trim();
    }

    if (thumbnail !== undefined) {
      updates.thumbnail = thumbnail && typeof thumbnail === 'string' ? thumbnail.trim() : null;
    }

    if (atsScore !== undefined) {
      if (atsScore !== null && (typeof atsScore !== 'number' || isNaN(atsScore))) {
        return NextResponse.json(
          { error: 'atsScore must be a number or null', code: 'INVALID_ATS_SCORE' },
          { status: 400 }
        );
      }
      updates.atsScore = atsScore;
    }

    const updatedResume = await db
      .update(resumes)
      .set(updates)
      .where(eq(resumes.id, resumeId))
      .returning();

    return NextResponse.json(updatedResume[0], { status: 200 });
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

    const resumeId = parseInt(id);
    if (isNaN(resumeId)) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if resume exists
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedResume = await db
      .delete(resumes)
      .where(eq(resumes.id, resumeId))
      .returning();

    return NextResponse.json(
      {
        message: 'Resume deleted successfully',
        resume: deletedResume[0],
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