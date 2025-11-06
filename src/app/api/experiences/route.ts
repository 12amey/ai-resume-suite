import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { experiences } from '@/db/schema';
import { eq, and, asc, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const resumeId = searchParams.get('resumeId');

    // Single experience by ID
    if (id) {
      const experienceId = parseInt(id);
      if (isNaN(experienceId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const experience = await db
        .select()
        .from(experiences)
        .where(eq(experiences.id, experienceId))
        .limit(1);

      if (experience.length === 0) {
        return NextResponse.json(
          { error: 'Experience not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(experience[0], { status: 200 });
    }

    // List experiences by resumeId
    if (!resumeId) {
      return NextResponse.json(
        { error: 'resumeId query parameter is required', code: 'MISSING_RESUME_ID' },
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

    const experiencesList = await db
      .select()
      .from(experiences)
      .where(eq(experiences.resumeId, resumeIdInt))
      .orderBy(asc(experiences.orderIndex), desc(experiences.startDate));

    return NextResponse.json(experiencesList, { status: 200 });
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
      resumeId,
      sourceType,
      sourceId,
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      orderIndex,
    } = body;

    // Validate required field
    if (!resumeId) {
      return NextResponse.json(
        { error: 'resumeId is required', code: 'MISSING_RESUME_ID' },
        { status: 400 }
      );
    }

    if (typeof resumeId !== 'number' || isNaN(resumeId)) {
      return NextResponse.json(
        { error: 'resumeId must be a valid integer', code: 'INVALID_RESUME_ID' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (current !== undefined && typeof current !== 'boolean') {
      return NextResponse.json(
        { error: 'current must be a boolean', code: 'INVALID_CURRENT' },
        { status: 400 }
      );
    }

    if (orderIndex !== undefined && (typeof orderIndex !== 'number' || isNaN(orderIndex))) {
      return NextResponse.json(
        { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    if (sourceId !== undefined && (typeof sourceId !== 'number' || isNaN(sourceId))) {
      return NextResponse.json(
        { error: 'sourceId must be a valid integer', code: 'INVALID_SOURCE_ID' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      resumeId,
      sourceType: sourceType ? sourceType.trim() : null,
      sourceId: sourceId ?? null,
      company: company ? company.trim() : null,
      position: position ? position.trim() : null,
      startDate: startDate ? startDate.trim() : null,
      endDate: endDate ? endDate.trim() : null,
      current: current ?? false,
      description: description ? description.trim() : null,
      orderIndex: orderIndex ?? 0,
    };

    const newExperience = await db
      .insert(experiences)
      .values(insertData)
      .returning();

    return NextResponse.json(newExperience[0], { status: 201 });
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

    const experienceId = parseInt(id);
    const body = await request.json();
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      orderIndex,
    } = body;

    // Validate optional fields
    if (current !== undefined && typeof current !== 'boolean') {
      return NextResponse.json(
        { error: 'current must be a boolean', code: 'INVALID_CURRENT' },
        { status: 400 }
      );
    }

    if (orderIndex !== undefined && (typeof orderIndex !== 'number' || isNaN(orderIndex))) {
      return NextResponse.json(
        { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    // Check if experience exists
    const existingExperience = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, experienceId))
      .limit(1);

    if (existingExperience.length === 0) {
      return NextResponse.json(
        { error: 'Experience not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (company !== undefined) updateData.company = company ? company.trim() : null;
    if (position !== undefined) updateData.position = position ? position.trim() : null;
    if (startDate !== undefined) updateData.startDate = startDate ? startDate.trim() : null;
    if (endDate !== undefined) updateData.endDate = endDate ? endDate.trim() : null;
    if (current !== undefined) updateData.current = current;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;

    const updatedExperience = await db
      .update(experiences)
      .set(updateData)
      .where(eq(experiences.id, experienceId))
      .returning();

    if (updatedExperience.length === 0) {
      return NextResponse.json(
        { error: 'Experience not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedExperience[0], { status: 200 });
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

    const experienceId = parseInt(id);

    // Check if experience exists before deleting
    const existingExperience = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, experienceId))
      .limit(1);

    if (existingExperience.length === 0) {
      return NextResponse.json(
        { error: 'Experience not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedExperience = await db
      .delete(experiences)
      .where(eq(experiences.id, experienceId))
      .returning();

    return NextResponse.json(
      {
        message: 'Experience deleted successfully',
        experience: deletedExperience[0],
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