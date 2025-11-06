import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  resumes, 
  personalInfo, 
  experiences, 
  education, 
  resumeSkills,
  skills,
  certifications,
  projects
} from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeId = parseInt(params.id);
    
    if (isNaN(resumeId)) {
      return NextResponse.json(
        { error: 'Valid resume ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch resume basic info
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Fetch all related data in parallel
    const [
      personalInfoData,
      experiencesData,
      educationData,
      resumeSkillsData,
      certificationsData,
      projectsData
    ] = await Promise.all([
      db.select().from(personalInfo).where(eq(personalInfo.resumeId, resumeId)).limit(1),
      db.select().from(experiences).where(eq(experiences.resumeId, resumeId)),
      db.select().from(education).where(eq(education.resumeId, resumeId)),
      db.select({
        id: resumeSkills.id,
        resumeId: resumeSkills.resumeId,
        skillId: resumeSkills.skillId,
        orderIndex: resumeSkills.orderIndex,
        skill: skills
      })
      .from(resumeSkills)
      .leftJoin(skills, eq(resumeSkills.skillId, skills.id))
      .where(eq(resumeSkills.resumeId, resumeId)),
      db.select().from(certifications).where(eq(certifications.resumeId, resumeId)),
      db.select().from(projects).where(eq(projects.userId, resume.userId))
    ]);

    // Transform data to match frontend format
    const responseData = {
      id: resume.id,
      userId: resume.userId,
      name: resume.name,
      template: resume.template,
      thumbnail: resume.thumbnail,
      atsScore: resume.atsScore,
      lastUpdated: resume.lastUpdated,
      createdAt: resume.createdAt,
      personalInfo: personalInfoData[0] || {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: ''
      },
      experience: experiencesData.map(exp => ({
        id: exp.id.toString(),
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || ''
      })),
      education: educationData.map(edu => ({
        id: edu.id.toString(),
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        grade: edu.grade || ''
      })),
      skills: resumeSkillsData
        .filter(rs => rs.skill)
        .map(rs => rs.skill!.name),
      projects: projectsData.map(proj => ({
        id: proj.id.toString(),
        name: proj.name,
        description: proj.description || '',
        link: proj.link || ''
      })),
      certifications: certificationsData.map(cert => ({
        id: cert.id.toString(),
        name: cert.name,
        issuer: cert.issuer || '',
        date: cert.date || ''
      }))
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('GET /api/resumes/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}