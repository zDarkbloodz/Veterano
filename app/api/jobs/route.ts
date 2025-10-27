import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "software engineer";
  const location = searchParams.get("location") || "United States";
  const veteranFriendly = searchParams.get("veteran_friendly") === "true";

  try {
    // Note: Indeed API requires publisher ID. For MVP, we'll use mock data
    // To use real Indeed API, uncomment the code below and add your publisher ID

    /*
    const indeedUrl = new URL("https://api.indeed.com/ads/apisearch");
    indeedUrl.searchParams.append("publisher", process.env.INDEED_PUBLISHER_ID!);
    indeedUrl.searchParams.append("q", query);
    indeedUrl.searchParams.append("l", location);
    indeedUrl.searchParams.append("format", "json");
    indeedUrl.searchParams.append("v", "2");
    indeedUrl.searchParams.append("limit", "25");

    if (veteranFriendly) {
      indeedUrl.searchParams.append("q", `${query} veteran friendly OR veteran preference`);
    }

    const response = await fetch(indeedUrl.toString());
    const data = await response.json();

    const jobs = data.results?.map((job: any) => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      type: "full-time",
      experience: "mid",
      description: job.snippet,
      requirements: [],
      benefits: [],
      veteranFriendly: job.snippet.toLowerCase().includes("veteran"),
      veteranPreference: job.snippet.toLowerCase().includes("veteran preference"),
      postedAt: new Date(job.date),
      applyUrl: job.url,
      source: "indeed",
      tags: [],
    })) || [];
    */

    // Mock data for MVP (until Indeed API credentials are added)
    const mockJobs = [
      {
        id: "1",
        title: "Frontend Developer",
        company: "TechVets Inc",
        location: "Remote",
        type: "full-time",
        experience: "mid",
        description: "We're seeking a talented Frontend Developer to join our growing team. This role is perfect for veterans transitioning to tech careers.",
        requirements: ["React", "TypeScript", "CSS"],
        benefits: ["Health Insurance", "401k", "Remote Work"],
        veteranFriendly: true,
        veteranPreference: true,
        securityClearance: "none",
        postedAt: new Date("2025-10-20"),
        expiresAt: new Date("2025-11-20"),
        applyUrl: "https://example.com/apply/1",
        source: "manual" as const,
        tags: ["frontend", "react", "remote"],
      },
      {
        id: "2",
        title: "Software Engineer",
        company: "Veterans First Technologies",
        location: "San Diego, CA",
        type: "full-time",
        experience: "entry",
        description: "Join our veteran-led software development team. We value military experience and provide comprehensive training.",
        requirements: ["JavaScript", "Python", "Git"],
        benefits: ["Health Insurance", "Veteran Support Program", "Flexible Hours"],
        veteranFriendly: true,
        veteranPreference: false,
        securityClearance: "none",
        postedAt: new Date("2025-10-22"),
        expiresAt: new Date("2025-11-22"),
        applyUrl: "https://example.com/apply/2",
        source: "manual" as const,
        tags: ["software", "entry-level", "veteran-friendly"],
      },
      {
        id: "3",
        title: "DevOps Engineer",
        company: "Defense Tech Solutions",
        location: "Washington, DC",
        type: "full-time",
        experience: "senior",
        description: "Seeking experienced DevOps Engineer with security clearance. Military background strongly preferred.",
        requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        benefits: ["Security Clearance Support", "Relocation Assistance", "Professional Development"],
        veteranFriendly: true,
        veteranPreference: true,
        securityClearance: "secret",
        postedAt: new Date("2025-10-25"),
        expiresAt: new Date("2025-11-25"),
        applyUrl: "https://example.com/apply/3",
        source: "manual" as const,
        tags: ["devops", "security-clearance", "senior"],
      },
      {
        id: "4",
        title: "Full Stack Developer",
        company: "CodeVeterans",
        location: "Austin, TX",
        type: "full-time",
        experience: "mid",
        description: "Work on cutting-edge web applications in a veteran-supportive environment. We offer mentorship and career growth.",
        requirements: ["Node.js", "React", "MongoDB", "REST APIs"],
        benefits: ["Mentorship Program", "Health Benefits", "Gym Membership"],
        veteranFriendly: true,
        veteranPreference: false,
        securityClearance: "none",
        postedAt: new Date("2025-10-23"),
        expiresAt: new Date("2025-11-23"),
        applyUrl: "https://example.com/apply/4",
        source: "manual" as const,
        tags: ["fullstack", "nodejs", "react"],
      },
      {
        id: "5",
        title: "Cybersecurity Analyst",
        company: "SecureNet Veterans",
        location: "Remote",
        type: "full-time",
        experience: "mid",
        description: "Protect critical infrastructure with your military-trained attention to detail. Veterans with security experience encouraged to apply.",
        requirements: ["Network Security", "Penetration Testing", "Security Auditing"],
        benefits: ["Remote Work", "Certification Support", "Veteran Networking Events"],
        veteranFriendly: true,
        veteranPreference: true,
        securityClearance: "confidential",
        postedAt: new Date("2025-10-24"),
        expiresAt: new Date("2025-11-24"),
        applyUrl: "https://example.com/apply/5",
        source: "manual" as const,
        tags: ["cybersecurity", "remote", "veteran-preferred"],
      },
    ];

    // Filter by veteran-friendly if requested
    const filteredJobs = veteranFriendly
      ? mockJobs.filter(job => job.veteranFriendly)
      : mockJobs;

    // Filter by query if provided
    const searchResults = query && query !== "software engineer"
      ? filteredJobs.filter(job =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      : filteredJobs;

    return NextResponse.json({
      data: searchResults,
      total: searchResults.length,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
