import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, and, like, or, asc } from 'drizzle-orm';

const VALID_CATEGORIES = ['technical', 'soft', 'domain'];
const VALID_PROFICIENCIES = ['beginner', 'intermediate', 'advanced', 'expert'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Single skill by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const skill = await db
        .select()
        .from(skills)
        .where(eq(skills.id, parseInt(id)))
        .limit(1);

      if (skill.length === 0) {
        return NextResponse.json(
          { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(skill[0], { status: 200 });
    }

    // List skills by userId
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    let query = db.select().from(skills).where(eq(skills.userId, parseInt(userId)));

    // Apply filters
    const conditions = [eq(skills.userId, parseInt(userId))];

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      conditions.push(eq(skills.category, category));
    }

    if (search) {
      conditions.push(like(skills.name, `%${search}%`));
    }

    const results = await db
      .select()
      .from(skills)
      .where(and(...conditions))
      .orderBy(asc(skills.category), asc(skills.name));

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
    const { userId, name, category, proficiency, sourceType, sourceId } = body;

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

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    if (proficiency && !VALID_PROFICIENCIES.includes(proficiency)) {
      return NextResponse.json(
        { error: `Invalid proficiency. Must be one of: ${VALID_PROFICIENCIES.join(', ')}`, code: 'INVALID_PROFICIENCY' },
        { status: 400 }
      );
    }

    // Check for duplicate skill
    const trimmedName = name.trim();
    const existingSkill = await db
      .select()
      .from(skills)
      .where(and(eq(skills.userId, userId), eq(skills.name, trimmedName)))
      .limit(1);

    if (existingSkill.length > 0) {
      return NextResponse.json(
        { error: 'Skill already exists', code: 'DUPLICATE_SKILL' },
        { status: 400 }
      );
    }

    // Create new skill
    const newSkill = await db
      .insert(skills)
      .values({
        userId,
        name: trimmedName,
        category: category || null,
        proficiency: proficiency || null,
        sourceType: sourceType || null,
        sourceId: sourceId || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newSkill[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, category, proficiency } = body;

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
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

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    if (proficiency && !VALID_PROFICIENCIES.includes(proficiency)) {
      return NextResponse.json(
        { error: `Invalid proficiency. Must be one of: ${VALID_PROFICIENCIES.join(', ')}`, code: 'INVALID_PROFICIENCY' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (category !== undefined) updateData.category = category;
    if (proficiency !== undefined) updateData.proficiency = proficiency;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingSkill[0], { status: 200 });
    }

    // Update skill
    const updatedSkill = await db
      .update(skills)
      .set(updateData)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedSkill[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete skill
    const deletedSkill = await db
      .delete(skills)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Skill deleted successfully',
        skill: deletedSkill[0],
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