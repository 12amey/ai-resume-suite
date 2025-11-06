import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, desc, like, or, and, isNull, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single project by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ 
          error: 'Project not found',
          code: 'PROJECT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(project[0], { status: 200 });
    }

    // List projects with filters
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // userId is required for list queries
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required for listing projects",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Build query conditions
    const conditions = [eq(projects.userId, parseInt(userId))];

    if (status) {
      if (!['completed', 'in-progress', 'archived'].includes(status)) {
        return NextResponse.json({ 
          error: "Status must be one of: completed, in-progress, archived",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(projects.status, status));
    }

    if (search) {
      conditions.push(
        or(
          like(projects.name, `%${search}%`),
          like(projects.description, `%${search}%`)
        )!
      );
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    const results = await db.select()
      .from(projects)
      .where(whereCondition)
      .orderBy(
        sql`CASE WHEN ${projects.startDate} IS NULL THEN 1 ELSE 0 END`,
        desc(projects.startDate),
        desc(projects.createdAt)
      )
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
    const { userId, name, description, link, githubUrl, technologies, startDate, endDate, status } = body;

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

    if (!name || name.trim() === '') {
      return NextResponse.json({ 
        error: "name is required and cannot be empty",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status && !['completed', 'in-progress', 'archived'].includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: completed, in-progress, archived",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const newProject = await db.insert(projects)
      .values({
        userId: parseInt(userId),
        name: name.trim(),
        description: description?.trim() || null,
        link: link?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        technologies: technologies?.trim() || null,
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || 'in-progress',
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
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
    const { name, description, link, githubUrl, technologies, startDate, endDate, status } = body;

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Validate name if provided
    if (name !== undefined && name.trim() === '') {
      return NextResponse.json({ 
        error: "name cannot be empty",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status && !['completed', 'in-progress', 'archived'].includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: completed, in-progress, archived",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (link !== undefined) updateData.link = link?.trim() || null;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl?.trim() || null;
    if (technologies !== undefined) updateData.technologies = technologies?.trim() || null;
    if (startDate !== undefined) updateData.startDate = startDate || null;
    if (endDate !== undefined) updateData.endDate = endDate || null;
    if (status !== undefined) updateData.status = status;

    const updated = await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

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

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Project deleted successfully',
      project: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}