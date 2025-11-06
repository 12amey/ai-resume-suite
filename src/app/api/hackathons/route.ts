import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { hackathons } from '@/db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single hackathon by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const hackathon = await db
        .select()
        .from(hackathons)
        .where(eq(hackathons.id, parseInt(id)))
        .limit(1);

      if (hackathon.length === 0) {
        return NextResponse.json(
          { error: 'Hackathon not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(hackathon[0], { status: 200 });
    }

    // List hackathons - require userId for filtering
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required for list queries', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    let query = db.select().from(hackathons);

    // Apply filters
    const conditions = [eq(hackathons.userId, parseInt(userId))];

    if (search) {
      const searchCondition = or(
        like(hackathons.name, `%${search}%`),
        like(hackathons.organizer, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    query = query.where(and(...conditions));

    // Apply ordering, pagination
    const results = await query
      .orderBy(desc(hackathons.date))
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
    const {
      userId,
      name,
      organizer,
      date,
      position,
      projectName,
      description,
      technologies,
      teamSize,
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!date || typeof date !== 'string' || date.trim() === '') {
      return NextResponse.json(
        { error: 'date is required and must be a non-empty string', code: 'MISSING_DATE' },
        { status: 400 }
      );
    }

    // Validate teamSize if provided
    if (teamSize !== undefined && teamSize !== null && isNaN(parseInt(teamSize))) {
      return NextResponse.json(
        { error: 'teamSize must be a valid integer', code: 'INVALID_TEAM_SIZE' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      userId: parseInt(userId),
      name: name.trim(),
      date: date.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (organizer) insertData.organizer = organizer.trim();
    if (position) insertData.position = position.trim();
    if (projectName) insertData.projectName = projectName.trim();
    if (description) insertData.description = description.trim();
    if (technologies) insertData.technologies = technologies.trim();
    if (teamSize !== undefined && teamSize !== null) {
      insertData.teamSize = parseInt(teamSize);
    }

    const newHackathon = await db.insert(hackathons).values(insertData).returning();

    return NextResponse.json(newHackathon[0], { status: 201 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      organizer,
      date,
      position,
      projectName,
      description,
      technologies,
      teamSize,
    } = body;

    // Check if hackathon exists
    const existing = await db
      .select()
      .from(hackathons)
      .where(eq(hackathons.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Hackathon not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json(
        { error: 'name must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (date !== undefined && (typeof date !== 'string' || date.trim() === '')) {
      return NextResponse.json(
        { error: 'date must be a non-empty string', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }

    if (teamSize !== undefined && teamSize !== null && isNaN(parseInt(teamSize))) {
      return NextResponse.json(
        { error: 'teamSize must be a valid integer', code: 'INVALID_TEAM_SIZE' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (organizer !== undefined) updateData.organizer = organizer ? organizer.trim() : organizer;
    if (date !== undefined) updateData.date = date.trim();
    if (position !== undefined) updateData.position = position ? position.trim() : position;
    if (projectName !== undefined) updateData.projectName = projectName ? projectName.trim() : projectName;
    if (description !== undefined) updateData.description = description ? description.trim() : description;
    if (technologies !== undefined) updateData.technologies = technologies ? technologies.trim() : technologies;
    if (teamSize !== undefined) {
      updateData.teamSize = teamSize !== null ? parseInt(teamSize) : null;
    }

    const updated = await db
      .update(hackathons)
      .set(updateData)
      .where(eq(hackathons.id, parseInt(id)))
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if hackathon exists
    const existing = await db
      .select()
      .from(hackathons)
      .where(eq(hackathons.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Hackathon not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(hackathons)
      .where(eq(hackathons.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Hackathon deleted successfully',
        hackathon: deleted[0],
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