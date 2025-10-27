import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  veteranFriendly: boolean;
  veteranPreference: boolean;
  securityClearance?: string;
  postedAt: Date;
  expiresAt: Date;
  applyUrl: string;
  source: string;
  tags: string[];
  salary?: {
    min?: number;
    max?: number;
  };
}

// RemoteOK API (Free, no auth required)
async function fetchRemoteOK(query: string): Promise<JobResult[]> {
  try {
    const response = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Veterano Job Board (veterano.careers)",
      },
    });

    const jobs = response.data.slice(1); // First item is metadata

    // Filter by query if provided
    const filteredJobs = query
      ? jobs.filter((job: any) =>
          job.position?.toLowerCase().includes(query.toLowerCase()) ||
          job.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        )
      : jobs;

    return filteredJobs.slice(0, 20).map((job: any) => ({
      id: job.id || job.slug,
      title: job.position || "Untitled Position",
      company: job.company || "Unknown Company",
      location: job.location || "Remote",
      type: "full-time",
      experience: "mid",
      description: job.description || "",
      requirements: [],
      benefits: [],
      veteranFriendly: false, // RemoteOK doesn't have this flag
      veteranPreference: false,
      securityClearance: "none",
      postedAt: job.date ? new Date(job.date * 1000) : new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
      source: "remoteok",
      tags: job.tags || [],
      salary: job.salary_min && job.salary_max
        ? {
            min: job.salary_min,
            max: job.salary_max,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("RemoteOK API error:", error);
    return [];
  }
}

// Adzuna API (Free tier: 5000 calls/month)
async function fetchAdzuna(query: string, location: string = "us"): Promise<JobResult[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.log("Adzuna API credentials not configured");
    return [];
  }

  try {
    const searchQuery = query || "software engineer";
    const url = `https://api.adzuna.com/v1/api/jobs/${location}/search/1`;

    const response = await axios.get(url, {
      params: {
        app_id: appId,
        app_key: appKey,
        results_per_page: 20,
        what: searchQuery,
      },
    });

    return response.data.results.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || location,
      type: job.contract_time || "full-time",
      experience: "mid",
      description: job.description || "",
      requirements: [],
      benefits: [],
      veteranFriendly: job.description?.toLowerCase().includes("veteran") || false,
      veteranPreference: job.description?.toLowerCase().includes("veteran preference") || false,
      securityClearance: job.description?.toLowerCase().includes("clearance") ? "secret" : "none",
      postedAt: new Date(job.created),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: job.redirect_url,
      source: "adzuna",
      tags: job.category?.tag ? [job.category.tag] : [],
      salary: job.salary_min && job.salary_max
        ? {
            min: job.salary_min,
            max: job.salary_max,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Adzuna API error:", error);
    return [];
  }
}

// Mock data fallback
function getMockJobs(): JobResult[] {
  return [
    {
      id: "1",
      title: "Frontend Developer",
      company: "TechVets Inc",
      location: "Remote",
      type: "full-time",
      experience: "mid",
      description: "We're seeking a talented Frontend Developer to join our growing team. This role is perfect for veterans transitioning to tech careers. You'll work with React, TypeScript, and modern web technologies while contributing to products that help other veterans.",
      requirements: ["React", "TypeScript", "CSS"],
      benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "none",
      postedAt: new Date("2025-10-20"),
      expiresAt: new Date("2025-11-20"),
      applyUrl: "https://example.com/apply/1",
      source: "manual",
      tags: ["frontend", "react", "remote", "veteran-friendly"],
      salary: {
        min: 80000,
        max: 120000,
      },
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "Veterans First Technologies",
      location: "San Diego, CA",
      type: "full-time",
      experience: "entry",
      description: "Join our veteran-led software development team. We value military experience and provide comprehensive training. Work on cutting-edge projects while leveraging the leadership skills you developed in service.",
      requirements: ["JavaScript", "Python", "Git"],
      benefits: ["Health Insurance", "Veteran Support Program", "Professional Development", "Relocation Assistance"],
      veteranFriendly: true,
      veteranPreference: false,
      securityClearance: "none",
      postedAt: new Date("2025-10-22"),
      expiresAt: new Date("2025-11-22"),
      applyUrl: "https://example.com/apply/2",
      source: "manual",
      tags: ["software", "entry-level", "veteran-friendly", "python"],
      salary: {
        min: 70000,
        max: 95000,
      },
    },
    {
      id: "3",
      title: "DevOps Engineer",
      company: "Defense Tech Solutions",
      location: "Washington, DC",
      type: "full-time",
      experience: "senior",
      description: "Seeking experienced DevOps Engineer with security clearance. Military background strongly preferred. Work with AWS, Kubernetes, and modern CI/CD pipelines on mission-critical systems.",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      benefits: ["Security Clearance Support", "Relocation Assistance", "Professional Development", "Veteran Network"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "secret",
      postedAt: new Date("2025-10-25"),
      expiresAt: new Date("2025-11-25"),
      applyUrl: "https://example.com/apply/3",
      source: "manual",
      tags: ["devops", "security-clearance", "senior", "aws", "kubernetes"],
      salary: {
        min: 110000,
        max: 160000,
      },
    },
    {
      id: "4",
      title: "Full Stack Developer",
      company: "CodeVeterans",
      location: "Austin, TX",
      type: "full-time",
      experience: "mid",
      description: "Work on cutting-edge web applications in a veteran-supportive environment. We offer mentorship and career growth opportunities. Build scalable applications using Node.js, React, and MongoDB.",
      requirements: ["Node.js", "React", "MongoDB", "REST APIs"],
      benefits: ["Mentorship Program", "Health Benefits", "Gym Membership", "Learning Budget"],
      veteranFriendly: true,
      veteranPreference: false,
      securityClearance: "none",
      postedAt: new Date("2025-10-23"),
      expiresAt: new Date("2025-11-23"),
      applyUrl: "https://example.com/apply/4",
      source: "manual",
      tags: ["fullstack", "nodejs", "react", "mongodb"],
      salary: {
        min: 85000,
        max: 125000,
      },
    },
    {
      id: "5",
      title: "Cybersecurity Analyst",
      company: "SecureNet Veterans",
      location: "Remote",
      type: "full-time",
      experience: "mid",
      description: "Protect critical infrastructure with your military-trained attention to detail. Veterans with security experience encouraged to apply. Work on penetration testing, security audits, and incident response.",
      requirements: ["Network Security", "Penetration Testing", "Security Auditing", "SIEM Tools"],
      benefits: ["Remote Work", "Certification Support", "Veteran Networking Events", "Security Clearance Assistance"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "confidential",
      postedAt: new Date("2025-10-24"),
      expiresAt: new Date("2025-11-24"),
      applyUrl: "https://example.com/apply/5",
      source: "manual",
      tags: ["cybersecurity", "remote", "veteran-preferred", "security"],
      salary: {
        min: 95000,
        max: 140000,
      },
    },
  ];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "software engineer";
  const location = searchParams.get("location") || "us";
  const veteranFriendly = searchParams.get("veteran_friendly") === "true";

  try {
    let jobs: JobResult[] = [];
    let usedSource = "mock";

    // Try Adzuna first (better for veteran-specific searches)
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      const adzunaJobs = await fetchAdzuna(query, location);
      if (adzunaJobs.length > 0) {
        jobs = adzunaJobs;
        usedSource = "adzuna";
      }
    }

    // Fallback to RemoteOK if Adzuna didn't work or no results
    if (jobs.length === 0) {
      const remoteOKJobs = await fetchRemoteOK(query);
      if (remoteOKJobs.length > 0) {
        jobs = remoteOKJobs;
        usedSource = "remoteok";
      }
    }

    // Fallback to mock data if APIs didn't work
    if (jobs.length === 0) {
      console.log("Using mock job data");
      jobs = getMockJobs();
      usedSource = "mock";
    }

    // Filter by veteran-friendly if requested
    if (veteranFriendly && usedSource === "mock") {
      jobs = jobs.filter(job => job.veteranFriendly);
    }

    return NextResponse.json({
      data: jobs,
      total: jobs.length,
      metadata: {
        source: usedSource,
        query,
        veteranFriendly,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Return mock data on error
    const mockJobs = getMockJobs();
    return NextResponse.json({
      data: mockJobs,
      total: mockJobs.length,
      metadata: {
        source: "mock (error fallback)",
        error: "API error, using mock data",
        timestamp: new Date().toISOString(),
      },
    });
  }
}
