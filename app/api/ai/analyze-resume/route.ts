import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import OpenAI from "openai";

// Initialize AI clients
const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// System prompt for resume analysis
const SYSTEM_PROMPT = `You are an expert resume reviewer specializing in helping military veterans transition to tech careers. You understand military terminology, ranks, and experience, and can translate them effectively into civilian tech industry terms.

Analyze the resume and provide a comprehensive evaluation with:

1. **Overall Score (0-100)**: Based on content quality, format, and tech industry standards
2. **ATS Score (0-100)**: How well it will pass Applicant Tracking Systems
3. **Strengths**: 3-5 specific positive aspects
4. **Weaknesses**: 3-5 areas that need improvement
5. **Detailed Suggestions**: Categorized, prioritized advice for improvement
6. **Skill Gaps**: Missing skills for tech roles with learning resources
7. **Military-to-Civilian Translation**: Convert any military jargon to civilian equivalents

Be specific, actionable, and encouraging. Veterans bring valuable leadership, discipline, and problem-solving skills.

Return ONLY valid JSON with this exact structure:
{
  "overallScore": number,
  "atsScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": [
    {
      "category": "formatting" | "content" | "skills" | "experience" | "keywords",
      "severity": "critical" | "important" | "minor",
      "title": string,
      "description": string,
      "example": string (optional)
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "importance": "high" | "medium" | "low",
      "commonIn": string[],
      "learningResources": string[]
    }
  ],
  "civilianTranslation": {
    "militaryTerms": [
      {
        "military": string,
        "civilian": string,
        "context": string
      }
    ]
  }
}`;

// Mock data function for when no AI is available
function getMockAnalysis() {
  return {
    overallScore: 78,
    atsScore: 72,
    strengths: [
      "Clear demonstration of leadership experience from military service",
      "Strong technical skills in relevant programming languages",
      "Well-organized format with clear sections",
      "Quantifiable achievements and metrics included",
    ],
    weaknesses: [
      "Military jargon may not be understood by civilian recruiters",
      "Could benefit from more specific tech project examples",
      "Skills section could be better organized by category",
      "Missing links to portfolio or GitHub projects",
    ],
    suggestions: [
      {
        category: "content" as const,
        severity: "critical" as const,
        title: "Translate Military Experience",
        description: "Replace military-specific terms with civilian equivalents that hiring managers will understand. For example, 'Squad Leader' could be 'Team Lead managing 8-12 personnel'.",
        example: "Instead of 'Led tactical operations', use 'Managed cross-functional team operations under high-pressure conditions'",
      },
      {
        category: "skills" as const,
        severity: "important" as const,
        title: "Add Technical Project Examples",
        description: "Include 2-3 specific technical projects that demonstrate your coding skills. Link to GitHub repositories if available.",
        example: "Built a full-stack e-commerce application using React, Node.js, and MongoDB - [GitHub Link]",
      },
      {
        category: "formatting" as const,
        severity: "important" as const,
        title: "Organize Skills by Category",
        description: "Group your technical skills into categories like 'Programming Languages', 'Frameworks', 'Tools', and 'Soft Skills' for better readability.",
      },
      {
        category: "keywords" as const,
        severity: "minor" as const,
        title: "Add Industry Keywords",
        description: "Include keywords from job descriptions you're targeting to improve ATS (Applicant Tracking System) compatibility.",
      },
    ],
    skillGaps: [
      {
        skill: "React.js",
        importance: "high" as const,
        commonIn: ["Frontend Developer", "Full Stack Developer", "Software Engineer"],
        learningResources: [
          "freeCodeCamp React Curriculum",
          "React Official Documentation",
          "Scrimba Interactive React Course",
        ],
      },
      {
        skill: "Cloud Platforms (AWS/Azure)",
        importance: "high" as const,
        commonIn: ["DevOps Engineer", "Cloud Engineer", "Backend Developer"],
        learningResources: [
          "AWS Free Tier Training",
          "Microsoft Learn for Azure",
          "A Cloud Guru",
        ],
      },
      {
        skill: "Agile/Scrum Methodology",
        importance: "medium" as const,
        commonIn: ["Software Developer", "Product Manager", "Team Lead"],
        learningResources: [
          "Scrum.org Free Learning Paths",
          "Atlassian Agile Coach",
        ],
      },
    ],
    civilianTranslation: {
      militaryTerms: [
        {
          military: "Squad Leader",
          civilian: "Team Lead / Supervisor",
          context: "Managed and coordinated team of 8-12 personnel in high-pressure environments",
        },
        {
          military: "Tactical Operations",
          civilian: "Strategic Project Management",
          context: "Planned and executed complex operations requiring coordination across multiple teams",
        },
        {
          military: "Mission Planning",
          civilian: "Project Planning & Execution",
          context: "Developed comprehensive plans with contingencies for critical objectives",
        },
        {
          military: "Personnel Management",
          civilian: "Human Resources & Team Management",
          context: "Supervised recruitment, training, performance evaluation, and team development",
        },
      ],
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    let analysis = null;
    let usedProvider = "mock";

    // Try Groq first (fastest and free)
    if (groq) {
      try {
        console.log("Using Groq API for resume analysis");
        const completion = await groq.chat.completions.create({
          model: "llama-3.1-70b-versatile", // Fast, free, and high quality
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Please analyze this resume:\n\n${resumeText}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });

        analysis = JSON.parse(completion.choices[0].message.content || "{}");
        usedProvider = "groq";
      } catch (error) {
        console.error("Groq API error:", error);
        // Continue to next provider
      }
    }

    // Fallback to OpenAI if Groq failed
    if (!analysis && openai) {
      try {
        console.log("Using OpenAI API for resume analysis");
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Cheaper GPT-4 model
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Please analyze this resume:\n\n${resumeText}`,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        analysis = JSON.parse(completion.choices[0].message.content || "{}");
        usedProvider = "openai";
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Continue to mock data
      }
    }

    // Fallback to mock data if both APIs failed
    if (!analysis) {
      console.log("No AI API available, using mock analysis");
      analysis = getMockAnalysis();
      usedProvider = "mock";
    }

    return NextResponse.json({
      data: analysis,
      metadata: {
        provider: usedProvider,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
