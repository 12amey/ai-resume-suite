import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resumeSkills, skills } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('resumeId');

    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json({ 
        error: "Valid resumeId is required",
        code: "INVALID_RESUME_ID" 
      }, { status: 400 });
    }

    const results = await db
      .select({
        id: resumeSkills.id,
        resumeId: resumeSkills.resumeId,
        skillId: resumeSkills.skillId,
        orderIndex: resumeSkills.orderIndex,
        skill: {
          id: skills.id,
          userId: skills.userId,
          name: skills.name,
          category: skills.category,
          proficiency: skills.proficiency,
          sourceType: skills.sourceType,
          sourceId: skills.sourceId,
          createdAt: skills.createdAt,
        },
      })
      .from(resumeSkills)
      .leftJoin(skills, eq(resumeSkills.skillId, skills.id))
      .where(eq(resumeSkills.resumeId, parseInt(resumeId)))
      .orderBy(asc(resumeSkills.orderIndex));

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
    const { resumeId, skillId, orderIndex } = body;

    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json({ 
        error: "Valid resumeId is required",
        code: "MISSING_RESUME_ID" 
      }, { status: 400 });
    }

    if (!skillId || isNaN(parseInt(skillId))) {
      return NextResponse.json({ 
        error: "Valid skillId is required",
        code: "MISSING_SKILL_ID" 
      }, { status: 400 });
    }

    const existingAssociation = await db
      .select()
      .from(resumeSkills)
      .where(
        and(
          eq(resumeSkills.resumeId, parseInt(resumeId)),
          eq(resumeSkills.skillId, parseInt(skillId))
        )
      )
      .limit(1);

    if (existingAssociation.length > 0) {
      return NextResponse.json({ 
        error: "Skill already added to resume",
        code: "DUPLICATE_SKILL" 
      }, { status: 400 });
    }

    const newResumeSkill = await db
      .insert(resumeSkills)
      .values({
        resumeId: parseInt(resumeId),
        skillId: parseInt(skillId),
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
      })
      .returning();

    return NextResponse.json(newResumeSkill[0], { status: 201 });
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
    const { orderIndex } = body;

    if (orderIndex === undefined || isNaN(parseInt(orderIndex))) {
      return NextResponse.json({ 
        error: "Valid orderIndex is required",
        code: "INVALID_ORDER_INDEX" 
      }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(resumeSkills)
      .where(eq(resumeSkills.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Resume skill association not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const updated = await db
      .update(resumeSkills)
      .set({
        orderIndex: parseInt(orderIndex),
      })
      .where(eq(resumeSkills.id, parseInt(id)))
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

    const existing = await db
      .select()
      .from(resumeSkills)
      .where(eq(resumeSkills.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Resume skill association not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db
      .delete(resumeSkills)
      .where(eq(resumeSkills.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Resume skill association deleted successfully',
      deletedRecord: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}