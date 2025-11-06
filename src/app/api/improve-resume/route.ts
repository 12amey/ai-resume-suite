import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { text, type, context } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let prompt = "";

    switch (type) {
      case "summary":
        prompt = `Improve this resume summary to be more professional, impactful, and ATS-friendly. Keep it concise (2-3 sentences) and focus on key achievements and skills:\n\n"${text}"\n\nReturn only the improved summary text, nothing else.`;
        break;
      
      case "experience":
        prompt = `Improve this job experience bullet point to be more impactful and achievement-focused. Use action verbs and quantify results when possible:\n\n"${text}"\n\nContext: ${context || "Software Engineering role"}\n\nReturn only the improved bullet point, nothing else.`;
        break;
      
      case "skills":
        prompt = `Given this list of skills: "${text}"\n\nFor the role: ${context || "Software Engineer"}\n\nSuggest 5-10 additional relevant skills that would strengthen this resume. Return as a comma-separated list.`;
        break;
      
      case "ats-friendly":
        prompt = `Rewrite this resume text to be more ATS (Applicant Tracking System) friendly. Use industry-standard keywords and avoid complex formatting:\n\n"${text}"\n\nReturn only the ATS-optimized text, nothing else.`;
        break;
      
      case "keywords":
        prompt = `Add relevant industry keywords to this resume text for a ${context || "Software Engineer"} position:\n\n"${text}"\n\nReturn the enhanced text with keywords naturally integrated.`;
        break;
      
      default:
        prompt = `Improve this resume text to be more professional and impactful:\n\n"${text}"\n\nReturn only the improved text, nothing else.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text().trim();

    return NextResponse.json({
      original: text,
      improved: improvedText,
      type
    });

  } catch (error: any) {
    console.error("Resume improvement error:", error);
    return NextResponse.json(
      { 
        error: "Failed to improve resume text",
        details: error.message 
      },
      { status: 500 }
    );
  }
}