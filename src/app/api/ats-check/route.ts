import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobTitle } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume for a ${jobTitle || "software engineering"} position and provide a detailed ATS score analysis.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Provide your response in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "score": <number 0-100>,
  "issues": [
    {
      "type": "error" | "warning" | "success",
      "title": "Issue title",
      "description": "Detailed description",
      "suggestion": "How to fix this"
    }
  ],
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"],
    "repeated": ["keyword5"]
  },
  "scoreBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "content": <number 0-100>,
    "experience": <number 0-100>
  }
}

Analyze:
1. Formatting issues (tables, images, columns that ATS can't parse)
2. Keyword optimization for ${jobTitle || "the role"}
3. Content quality and relevance
4. Experience presentation
5. Missing critical sections

Provide actionable suggestions for improvement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    // Try to parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, return a fallback structure
      analysis = {
        score: 75,
        issues: [
          {
            type: "warning",
            title: "Analysis Parsing Issue",
            description: "AI response format was unexpected",
            suggestion: "Manual review recommended"
          }
        ],
        keywords: {
          found: [],
          missing: [],
          repeated: []
        },
        scoreBreakdown: {
          formatting: 75,
          keywords: 70,
          content: 80,
          experience: 75
        }
      };
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to analyze resume",
        score: 0,
        issues: [],
        keywords: { found: [], missing: [], repeated: [] },
        scoreBreakdown: { formatting: 0, keywords: 0, content: 0, experience: 0 }
      },
      { status: 500 }
    );
  }
}