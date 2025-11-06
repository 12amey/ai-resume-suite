import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { resumes, experiences, education, skills, projects, achievements } from "@/db/schema";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface ResumeAnalysisResult {
  resumeScore: number;
  atsScore: number;
  skillGaps: {
    missing: string[];
    recommended: string[];
    current: string[];
  };
  suggestions: {
    type: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact: string;
  }[];
  careerProgress: {
    totalExperience: number;
    totalProjects: number;
    totalSkills: number;
    educationLevel: string;
    growthRate: number;
  };
  keywordAnalysis: {
    actionVerbs: number;
    quantifiableResults: number;
    industryKeywords: string[];
    missingKeywords: string[];
  };
  improvements: {
    summary: string;
    experience: string[];
    skills: string[];
    overall: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { resumeId, targetRole } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Fetch resume data
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Fetch related data
    const [experienceData, educationData, skillsData, projectsData, achievementsData] = await Promise.all([
      db.select().from(experiences).where(eq(experiences.userId, resume.userId)),
      db.select().from(education).where(eq(education.userId, resume.userId)),
      db.select().from(skills).where(eq(skills.userId, resume.userId)),
      db.select().from(projects).where(eq(projects.userId, resume.userId)),
      db.select().from(achievements).where(eq(achievements.userId, resume.userId))
    ]);

    // Build comprehensive resume text for AI analysis
    const resumeText = buildResumeText(resume, experienceData, educationData, skillsData, projectsData);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Perform AI analysis
    const analysisPrompt = `You are an expert career coach and ATS specialist. Analyze this resume comprehensively:

TARGET ROLE: ${targetRole || "General Professional"}

RESUME DATA:
${resumeText}

Provide a detailed analysis in the following JSON format:
{
  "resumeScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "skillGaps": {
    "missing": [<array of skills missing for target role>],
    "recommended": [<array of skills to add>],
    "current": [<array of current strong skills>]
  },
  "suggestions": [
    {
      "type": "summary|experience|skills|formatting|keywords",
      "priority": "high|medium|low",
      "title": "<short title>",
      "description": "<detailed description>",
      "impact": "<expected impact>"
    }
  ],
  "keywordAnalysis": {
    "actionVerbs": <count>,
    "quantifiableResults": <count>,
    "industryKeywords": [<array of found industry keywords>],
    "missingKeywords": [<array of important missing keywords>]
  },
  "improvements": {
    "summary": "<improved summary text>",
    "experience": [<array of improved experience bullets>],
    "skills": [<array of recommended skills to add>],
    "overall": "<overall improvement strategy>"
  }
}

Be specific, actionable, and focus on measurable improvements.`;

    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    let analysisText = response.text().trim();
    
    // Clean up JSON response
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis: ResumeAnalysisResult = JSON.parse(analysisText);

    // Calculate career progress metrics
    const careerProgress = {
      totalExperience: experienceData.length,
      totalProjects: projectsData.length,
      totalSkills: skillsData.length,
      educationLevel: educationData.length > 0 ? educationData[0].degree || "Not specified" : "Not specified",
      growthRate: calculateGrowthRate(achievementsData, experienceData, projectsData)
    };

    analysis.careerProgress = careerProgress;

    return NextResponse.json({
      success: true,
      analysis,
      resumeId,
      targetRole: targetRole || "General Professional",
      analyzedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze resume",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function buildResumeText(
  resume: any,
  experiences: any[],
  education: any[],
  skills: any[],
  projects: any[]
): string {
  let text = `SUMMARY:\n${resume.summary || "Not provided"}\n\n`;

  text += `EXPERIENCE:\n`;
  experiences.forEach(exp => {
    text += `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})\n`;
    if (exp.description) text += `  ${exp.description}\n`;
  });

  text += `\nEDUCATION:\n`;
  education.forEach(edu => {
    text += `- ${edu.degree} from ${edu.institution} (${edu.graduationYear})\n`;
  });

  text += `\nSKILLS:\n`;
  skills.forEach(skill => {
    text += `- ${skill.name} (${skill.level || "Intermediate"})\n`;
  });

  text += `\nPROJECTS:\n`;
  projects.forEach(proj => {
    text += `- ${proj.name}: ${proj.description || ""}\n`;
  });

  return text;
}

function calculateGrowthRate(
  achievements: any[],
  experiences: any[],
  projects: any[]
): number {
  // Calculate growth rate based on activity over time
  const currentYear = new Date().getFullYear();
  const recentAchievements = achievements.filter(a => {
    const year = new Date(a.createdAt).getFullYear();
    return currentYear - year <= 1;
  }).length;

  const totalActivity = experiences.length + projects.length + achievements.length;
  const growthRate = totalActivity > 0 ? Math.min(100, (recentAchievements / totalActivity) * 100 + 50) : 0;
  
  return Math.round(growthRate);
}