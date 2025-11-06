import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { personalInfo } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('resumeId');

    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json(
        { error: 'Valid resumeId is required', code: 'INVALID_RESUME_ID' },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.resumeId, parseInt(resumeId)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Personal info not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
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
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      website,
      summary,
    } = body;

    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json(
        { error: 'Valid resumeId is required', code: 'MISSING_RESUME_ID' },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.resumeId, parseInt(resumeId)))
      .limit(1);

    const data = {
      fullName: fullName?.trim() || null,
      title: title?.trim() || null,
      email: email?.trim()?.toLowerCase() || null,
      phone: phone?.trim() || null,
      location: location?.trim() || null,
      linkedin: linkedin?.trim() || null,
      website: website?.trim() || null,
      summary: summary?.trim() || null,
    };

    if (existing.length > 0) {
      const updated = await db
        .update(personalInfo)
        .set(data)
        .where(eq(personalInfo.resumeId, parseInt(resumeId)))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      const newRecord = await db
        .insert(personalInfo)
        .values({
          resumeId: parseInt(resumeId),
          ...data,
        })
        .returning();

      return NextResponse.json(newRecord[0], { status: 201 });
    }
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
      fullName,
      title,
      email,
      phone,
      location,
      linkedin,
      website,
      summary,
    } = body;

    const existing = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Personal info not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {};

    if (fullName !== undefined) updates.fullName = fullName?.trim() || null;
    if (title !== undefined) updates.title = title?.trim() || null;
    if (email !== undefined) updates.email = email?.trim()?.toLowerCase() || null;
    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (location !== undefined) updates.location = location?.trim() || null;
    if (linkedin !== undefined) updates.linkedin = linkedin?.trim() || null;
    if (website !== undefined) updates.website = website?.trim() || null;
    if (summary !== undefined) updates.summary = summary?.trim() || null;

    const updated = await db
      .update(personalInfo)
      .set(updates)
      .where(eq(personalInfo.id, parseInt(id)))
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

    const existing = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Personal info not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(personalInfo)
      .where(eq(personalInfo.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Personal info deleted successfully',
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