import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI only if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

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

    // If OpenAI API key is not configured, return mock data
    if (!openai) {
      console.log("OpenAI API key not configured, returning mock analysis");

      // Return realistic mock analysis
      const mockAnalysis = {
        overallScore: 78,
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
        atsScore: 72,
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

      return NextResponse.json({ data: mockAnalysis });
    }

    // Call OpenAI to analyze resume
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer specializing in helping military veterans transition to tech careers. Analyze the resume and provide:

1. Overall score (0-100)
2. Strengths (array of strings)
3. Weaknesses (array of strings)
4. Specific suggestions for improvement
5. Skill gaps for tech roles
6. ATS-friendliness score
7. Military-to-civilian translations for any military terms

Format your response as JSON with this structure:
{
  "overallScore": number,
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
  "atsScore": number,
  "civilianTranslation": {
    "militaryTerms": [
      {
        "military": string,
        "civilian": string,
        "context": string
      }
    ]
  }
}`,
        },
        {
          role: "user",
          content: `Please analyze this resume:\n\n${resumeText}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
