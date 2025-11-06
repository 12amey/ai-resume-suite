import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { internships, hackathons, courses, projects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');

    // Validate userId parameter
    if (!userIdParam) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json(
        { 
          error: 'Valid User ID is required',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Fetch all achievement types in parallel for performance
    const [
      userInternships,
      userHackathons,
      userCourses,
      userProjects
    ] = await Promise.all([
      db.select()
        .from(internships)
        .where(eq(internships.userId, userId))
        .orderBy(desc(internships.startDate)),
      
      db.select()
        .from(hackathons)
        .where(eq(hackathons.userId, userId))
        .orderBy(desc(hackathons.date)),
      
      db.select()
        .from(courses)
        .where(eq(courses.userId, userId))
        .orderBy(desc(courses.completionDate)),
      
      db.select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.startDate))
    ]);

    // Calculate summary statistics
    const totalInternships = userInternships.length;
    const totalHackathons = userHackathons.length;
    const totalCourses = userCourses.length;
    const totalProjects = userProjects.length;
    const totalAchievements = totalInternships + totalHackathons + totalCourses + totalProjects;

    // Return structured response
    return NextResponse.json({
      userId,
      internships: userInternships,
      hackathons: userHackathons,
      courses: userCourses,
      projects: userProjects,
      summary: {
        totalInternships,
        totalHackathons,
        totalCourses,
        totalProjects,
        totalAchievements
      }
    });

  } catch (error) {
    console.error('GET /api/users/achievements error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}