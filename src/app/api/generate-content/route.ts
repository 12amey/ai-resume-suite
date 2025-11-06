import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { type, inputs } = await request.json();

    if (!type || !inputs) {
      return NextResponse.json(
        { error: "Type and inputs are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let prompt = "";

    switch (type) {
      case "cover-letter":
        prompt = `Write a professional ${inputs.tone} cover letter for a ${inputs.jobTitle} position at ${inputs.company}. The candidate has ${inputs.experience} of experience. Make it compelling, specific, and ATS-friendly. Include proper formatting with paragraphs.`;
        break;

      case "linkedin":
        prompt = `Write a ${inputs.tone} LinkedIn summary for a ${inputs.role} with ${inputs.years} years of experience. Key skills: ${inputs.skills}. Make it engaging, professional, and include relevant emojis where appropriate. Keep it concise but impactful.`;
        break;

      case "job-description":
        prompt = `Create a comprehensive job description for a ${inputs.title} position in the ${inputs.department} department. Employment type: ${inputs.type}. Include: role overview, key responsibilities (5-7 bullet points), qualifications (5-6 bullet points), and what the company offers. Make it professional and attractive to candidates.`;
        break;

      case "bio":
        prompt = `Write a ${inputs.tone} professional bio for ${inputs.name}, who is a ${inputs.profession} specializing in ${inputs.specialty}. Make it engaging, concise (2-3 paragraphs), and highlight their expertise and personality.`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid content type" },
          { status: 400 }
        );
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}