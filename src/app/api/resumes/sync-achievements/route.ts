import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resumes, internships, hackathons, courses, projects, experiences, skills, resumeSkills } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeId } = body;

    // Validate resumeId
    if (!resumeId || isNaN(parseInt(resumeId))) {
      return NextResponse.json({ 
        error: "Valid resumeId is required",
        code: "INVALID_RESUME_ID" 
      }, { status: 400 });
    }

    const resumeIdInt = parseInt(resumeId);

    // Verify resume exists and get userId
    const resume = await db.select()
      .from(resumes)
      .where(eq(resumes.id, resumeIdInt))
      .limit(1);

    if (resume.length === 0) {
      return NextResponse.json({ 
        error: 'Resume not found',
        code: 'RESUME_NOT_FOUND' 
      }, { status: 404 });
    }

    const userId = resume[0].userId;

    // Fetch all user's achievements
    const [userInternships, userHackathons, userCourses, userProjects] = await Promise.all([
      db.select().from(internships).where(eq(internships.userId, userId)),
      db.select().from(hackathons).where(eq(hackathons.userId, userId)),
      db.select().from(courses).where(eq(courses.userId, userId)),
      db.select().from(projects).where(eq(projects.userId, userId))
    ]);

    // Get existing experiences to avoid duplicates
    const existingExperiences = await db.select()
      .from(experiences)
      .where(eq(experiences.resumeId, resumeIdInt));

    const existingExperienceKeys = new Set(
      existingExperiences
        .filter(exp => exp.sourceType && exp.sourceId)
        .map(exp => `${exp.sourceType}-${exp.sourceId}`)
    );

    // Transform internships into experience records
    const internshipExperiences = userInternships
      .filter(internship => !existingExperienceKeys.has(`internship-${internship.id}`))
      .map((internship, index) => ({
        resumeId: resumeIdInt,
        sourceType: 'internship',
        sourceId: internship.id,
        company: internship.company,
        position: internship.position,
        startDate: internship.startDate,
        endDate: internship.endDate || null,
        current: internship.current || false,
        description: internship.description || null,
        orderIndex: existingExperiences.length + index
      }));

    // Transform significant hackathons into experience records
    const hackathonExperiences = userHackathons
      .filter(hackathon => hackathon.position || hackathon.projectName)
      .filter(hackathon => !existingExperienceKeys.has(`hackathon-${hackathon.id}`))
      .map((hackathon, index) => {
        const description = [
          hackathon.position ? `Achievement: ${hackathon.position}` : '',
          hackathon.description || '',
          hackathon.technologies ? `Technologies: ${hackathon.technologies}` : '',
          hackathon.teamSize ? `Team Size: ${hackathon.teamSize}` : ''
        ].filter(Boolean).join('\n');

        return {
          resumeId: resumeIdInt,
          sourceType: 'hackathon',
          sourceId: hackathon.id,
          company: hackathon.organizer || hackathon.name,
          position: hackathon.projectName || hackathon.name,
          startDate: hackathon.date,
          endDate: hackathon.date,
          current: false,
          description: description || null,
          orderIndex: existingExperiences.length + internshipExperiences.length + index
        };
      });

    // Combine all new experiences
    const newExperiences = [...internshipExperiences, ...hackathonExperiences];

    // Insert new experiences
    let createdExperiences = [];
    if (newExperiences.length > 0) {
      createdExperiences = await db.insert(experiences)
        .values(newExperiences)
        .returning();
    }

    // Extract and deduplicate skills
    const allSkillsRaw: Array<{ name: string; sourceType: string; sourceId: number }> = [];

    // From internships
    userInternships.forEach(internship => {
      if (internship.skillsUsed) {
        const skillNames = internship.skillsUsed.split(',').map(s => s.trim()).filter(Boolean);
        skillNames.forEach(name => {
          allSkillsRaw.push({ name, sourceType: 'internship', sourceId: internship.id });
        });
      }
    });

    // From hackathons
    userHackathons.forEach(hackathon => {
      if (hackathon.technologies) {
        const techNames = hackathon.technologies.split(',').map(s => s.trim()).filter(Boolean);
        techNames.forEach(name => {
          allSkillsRaw.push({ name, sourceType: 'hackathon', sourceId: hackathon.id });
        });
      }
    });

    // From courses
    userCourses.forEach(course => {
      if (course.skillsLearned) {
        const skillNames = course.skillsLearned.split(',').map(s => s.trim()).filter(Boolean);
        skillNames.forEach(name => {
          allSkillsRaw.push({ name, sourceType: 'course', sourceId: course.id });
        });
      }
    });

    // From projects
    userProjects.forEach(project => {
      if (project.technologies) {
        const techNames = project.technologies.split(',').map(s => s.trim()).filter(Boolean);
        techNames.forEach(name => {
          allSkillsRaw.push({ name, sourceType: 'project', sourceId: project.id });
        });
      }
    });

    // Deduplicate skills by name (case-insensitive)
    const uniqueSkillsMap = new Map<string, { name: string; sourceType: string; sourceId: number }>();
    allSkillsRaw.forEach(skill => {
      const normalizedName = skill.name.toLowerCase();
      if (!uniqueSkillsMap.has(normalizedName)) {
        uniqueSkillsMap.set(normalizedName, skill);
      }
    });

    // Get existing skills for this user
    const existingUserSkills = await db.select()
      .from(skills)
      .where(eq(skills.userId, userId));

    const existingSkillNames = new Set(
      existingUserSkills.map(skill => skill.name.toLowerCase())
    );

    // Get existing resume-skill associations
    const existingResumeSkills = await db.select()
      .from(resumeSkills)
      .where(eq(resumeSkills.resumeId, resumeIdInt));

    const existingResumeSkillIds = new Set(
      existingResumeSkills.map(rs => rs.skillId)
    );

    // Create new skills that don't exist for this user
    const newSkills = Array.from(uniqueSkillsMap.values())
      .filter(skill => !existingSkillNames.has(skill.name.toLowerCase()))
      .map(skill => ({
        userId,
        name: skill.name,
        category: null,
        proficiency: null,
        sourceType: skill.sourceType,
        sourceId: skill.sourceId,
        createdAt: new Date().toISOString()
      }));

    let createdSkills = [];
    if (newSkills.length > 0) {
      createdSkills = await db.insert(skills)
        .values(newSkills)
        .returning();
    }

    // Get all user skills after creation (existing + newly created)
    const allUserSkills = await db.select()
      .from(skills)
      .where(eq(skills.userId, userId));

    // Create a map of skill name to skill id
    const skillNameToIdMap = new Map(
      allUserSkills.map(skill => [skill.name.toLowerCase(), skill.id])
    );

    // Link skills to resume that aren't already linked
    const skillsToLink = Array.from(uniqueSkillsMap.keys())
      .map(normalizedName => skillNameToIdMap.get(normalizedName))
      .filter((skillId): skillId is number => skillId !== undefined)
      .filter(skillId => !existingResumeSkillIds.has(skillId))
      .map((skillId, index) => ({
        resumeId: resumeIdInt,
        skillId,
        orderIndex: existingResumeSkills.length + index
      }));

    let linkedSkills = [];
    if (skillsToLink.length > 0) {
      linkedSkills = await db.insert(resumeSkills)
        .values(skillsToLink)
        .returning();
    }

    // Get full skill details for linked skills
    const linkedSkillDetails = allUserSkills.filter(skill => 
      skillsToLink.some(link => link.skillId === skill.id)
    );

    // Return summary
    return NextResponse.json({
      success: true,
      experiencesAdded: createdExperiences.length,
      skillsAdded: linkedSkills.length,
      newSkillsCreated: createdSkills.length,
      experiencesList: createdExperiences,
      skillsList: linkedSkillDetails,
      summary: {
        internshipsProcessed: internshipExperiences.length,
        hackathonsProcessed: hackathonExperiences.length,
        totalAchievementsScanned: {
          internships: userInternships.length,
          hackathons: userHackathons.length,
          courses: userCourses.length,
          projects: userProjects.length
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/resumes/sync-achievements error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}