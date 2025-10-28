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

// USAJobs API (Government jobs with REAL veteran preference!)
async function fetchUSAJobs(query: string, location: string = ""): Promise<JobResult[]> {
  const apiKey = process.env.USAJOBS_API_KEY;
  const userAgent = process.env.USAJOBS_USER_EMAIL || "veterano@example.com";

  if (!apiKey) {
    console.log("USAJobs API not configured");
    return [];
  }

  try {
    const searchQuery = query || "information technology";
    const url = "https://data.usajobs.gov/api/search";

    const response = await axios.get(url, {
      headers: {
        "Host": "data.usajobs.gov",
        "User-Agent": userAgent,
        "Authorization-Key": apiKey,
      },
      params: {
        Keyword: searchQuery,
        ResultsPerPage: 50,
        VeteranPreference: "true", // Only veteran preference jobs!
        ...(location && { LocationName: location }),
      },
    });

    const jobs = response.data.SearchResult?.SearchResultItems || [];

    return jobs.map((item: any) => {
      const job = item.MatchedObjectDescriptor;
      return {
        id: job.PositionID,
        title: job.PositionTitle,
        company: job.OrganizationName || job.DepartmentName || "U.S. Government",
        location: job.PositionLocationDisplay || "Various Locations",
        type: job.PositionSchedule?.[0]?.Name || "full-time",
        experience: "mid",
        description: job.UserArea?.Details?.JobSummary || job.PositionFormattedDescription?.[0]?.Content || "",
        requirements: [],
        benefits: ["Federal Benefits", "Veteran Preference", "Security Clearance Eligible"],
        veteranFriendly: true,
        veteranPreference: true,
        securityClearance: job.SecurityClearance || "varies",
        postedAt: new Date(job.PositionStartDate),
        expiresAt: new Date(job.PositionEndDate),
        applyUrl: job.PositionURI,
        source: "usajobs",
        tags: ["government", "veteran-preference", "federal"],
        salary: job.PositionRemuneration?.[0]?.MinimumRange && job.PositionRemuneration?.[0]?.MaximumRange
          ? {
              min: parseInt(job.PositionRemuneration[0].MinimumRange),
              max: parseInt(job.PositionRemuneration[0].MaximumRange),
            }
          : undefined,
      };
    });
  } catch (error) {
    console.error("USAJobs API error:", error);
    return [];
  }
}

// JSearch API via RapidAPI (Aggregates LinkedIn, Indeed, Glassdoor, etc.)
async function fetchJSearch(query: string, location: string = "United States"): Promise<JobResult[]> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.log("RapidAPI (JSearch) not configured");
    return [];
  }

  try {
    const searchQuery = query || "software engineer";
    const url = "https://jsearch.p.rapidapi.com/search";

    const response = await axios.get(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      params: {
        query: `${searchQuery} ${location}`,
        page: "1",
        num_pages: "1",
        date_posted: "month", // Jobs from last month
      },
    });

    const jobs = response.data.data || [];

    return jobs.slice(0, 20).map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name || "Unknown Company",
      location: job.job_city && job.job_state
        ? `${job.job_city}, ${job.job_state}`
        : job.job_country || location,
      type: job.job_employment_type || "full-time",
      experience: job.job_required_experience?.no_experience_required ? "entry" : "mid",
      description: job.job_description || "",
      requirements: job.job_required_skills || [],
      benefits: job.job_highlights?.Benefits || [],
      veteranFriendly: job.job_description?.toLowerCase().includes("veteran") || false,
      veteranPreference: job.job_description?.toLowerCase().includes("veteran preference") || false,
      securityClearance: job.job_description?.toLowerCase().includes("security clearance") ? "required" : "none",
      postedAt: new Date(job.job_posted_at_timestamp * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: job.job_apply_link,
      source: "jsearch",
      tags: [job.job_publisher?.toLowerCase() || "online"],
      salary: job.job_min_salary && job.job_max_salary
        ? {
            min: job.job_min_salary,
            max: job.job_max_salary,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("JSearch API error:", error);
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
        results_per_page: 50,
        what: searchQuery,
        what_or: "veteran IT technology software developer engineer", // Add veteran-related terms
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
      veteranFriendly: false,
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

// Enhanced mock data with more veteran-focused jobs
function getEnhancedMockJobs(): JobResult[] {
  return [
    {
      id: "1",
      title: "Frontend Developer - Veteran Preferred",
      company: "TechVets Inc",
      location: "Remote",
      type: "full-time",
      experience: "mid",
      description: "We're seeking a talented Frontend Developer to join our growing team. This role is perfect for veterans transitioning to tech careers. You'll work with React, TypeScript, and modern web technologies while contributing to products that help other veterans. We provide comprehensive training and mentorship for career changers with military backgrounds.",
      requirements: ["React", "TypeScript", "CSS", "Git"],
      benefits: ["Health Insurance", "401k Match", "Remote Work", "Flexible Hours", "Veteran Support Network", "Professional Development"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "none",
      postedAt: new Date("2025-10-20"),
      expiresAt: new Date("2025-11-20"),
      applyUrl: "https://example.com/apply/1",
      source: "manual",
      tags: ["frontend", "react", "remote", "veteran-friendly", "veteran-preferred"],
      salary: { min: 80000, max: 120000 },
    },
    {
      id: "2",
      title: "Software Engineer - Security Clearance",
      company: "Defense Tech Solutions",
      location: "Washington, DC",
      type: "full-time",
      experience: "mid",
      description: "Join our veteran-led software development team working on mission-critical defense systems. We value military experience and provide comprehensive training. Active Secret clearance required. Your military background gives you a significant advantage in this role.",
      requirements: ["JavaScript", "Python", "Git", "Active Secret Clearance"],
      benefits: ["Health Insurance", "Clearance Support", "Professional Development", "Veteran Network", "Relocation Assistance"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "secret",
      postedAt: new Date("2025-10-22"),
      expiresAt: new Date("2025-11-22"),
      applyUrl: "https://example.com/apply/2",
      source: "manual",
      tags: ["software", "security-clearance", "veteran-preferred", "python", "defense"],
      salary: { min: 95000, max: 145000 },
    },
    {
      id: "3",
      title: "DevOps Engineer - Top Secret Clearance",
      company: "Federal Technology Partners",
      location: "McLean, VA",
      type: "full-time",
      experience: "senior",
      description: "Seeking experienced DevOps Engineer with Top Secret clearance. Military background STRONGLY preferred. Work with AWS, Kubernetes, and modern CI/CD pipelines on classified systems. This role leverages the discipline and security awareness developed during military service.",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Top Secret Clearance"],
      benefits: ["Security Clearance Support", "Relocation Assistance", "Professional Development", "Veteran Network", "Federal Benefits"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "top-secret",
      postedAt: new Date("2025-10-25"),
      expiresAt: new Date("2025-11-25"),
      applyUrl: "https://example.com/apply/3",
      source: "manual",
      tags: ["devops", "security-clearance", "senior", "aws", "kubernetes", "top-secret"],
      salary: { min: 130000, max: 180000 },
    },
    {
      id: "4",
      title: "Full Stack Developer - Veteran Hiring Program",
      company: "CodeVeterans",
      location: "Austin, TX",
      type: "full-time",
      experience: "mid",
      description: "Part of our Veteran Hiring Program! Work on cutting-edge web applications in a veteran-supportive environment. We offer dedicated mentorship from veteran developers and career growth opportunities. No prior tech experience required - we train motivated veterans. Leverage your military problem-solving skills in software development.",
      requirements: ["Willingness to Learn", "Problem Solving", "Team Collaboration"],
      benefits: ["Veteran Mentorship Program", "Health Benefits", "Coding Bootcamp Sponsorship", "Gym Membership", "Learning Budget", "Flexible Hours"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "none",
      postedAt: new Date("2025-10-23"),
      expiresAt: new Date("2025-11-23"),
      applyUrl: "https://example.com/apply/4",
      source: "manual",
      tags: ["fullstack", "veteran-program", "entry-level", "training-provided", "austin"],
      salary: { min: 70000, max: 110000 },
    },
    {
      id: "5",
      title: "Cybersecurity Analyst - Veteran Preferred",
      company: "SecureNet Veterans",
      location: "Remote",
      type: "full-time",
      experience: "mid",
      description: "Protect critical infrastructure with your military-trained attention to detail. Veterans with security/intelligence experience STRONGLY encouraged to apply. Work on penetration testing, security audits, and incident response. We understand the value of military cybersecurity training and will help you translate it to the civilian sector.",
      requirements: ["Network Security", "Security Fundamentals", "Military Cyber/Intelligence Experience Preferred"],
      benefits: ["Remote Work", "Security Certification Support (CISSP, CEH, Security+)", "Veteran Networking Events", "Security Clearance Assistance", "Continuing Education"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "confidential",
      postedAt: new Date("2025-10-24"),
      expiresAt: new Date("2025-11-24"),
      applyUrl: "https://example.com/apply/5",
      source: "manual",
      tags: ["cybersecurity", "remote", "veteran-preferred", "security", "clearance-eligible"],
      salary: { min: 95000, max: 140000 },
    },
    {
      id: "6",
      title: "IT Systems Administrator - Government Contractor",
      company: "GovTech Solutions",
      location: "San Diego, CA",
      type: "full-time",
      experience: "entry",
      description: "Supporting DoD systems as a contractor. Perfect for veterans transitioning from military IT roles. We value your existing clearance and military IT experience. Entry-level civilian role but your military experience counts! Excellent benefits and veteran support network.",
      requirements: ["CompTIA Security+", "Active Clearance", "Basic IT Knowledge"],
      benefits: ["Clearance Support", "VA Benefits Compatible", "Professional Development", "Veteran Mentorship", "DoD Experience"],
      veteranFriendly: true,
      veteranPreference: true,
      securityClearance: "secret",
      postedAt: new Date("2025-10-26"),
      expiresAt: new Date("2025-11-26"),
      applyUrl: "https://example.com/apply/6",
      source: "manual",
      tags: ["it", "systems-admin", "government", "contractor", "veteran-preferred", "san-diego"],
      salary: { min: 65000, max: 85000 },
    },
  ];
}

// Deduplicate jobs based on title and company
function deduplicateJobs(jobs: JobResult[]): JobResult[] {
  const seen = new Set<string>();
  return jobs.filter(job => {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Score and sort jobs by veteran relevance
function scoreJobsForVeterans(jobs: JobResult[]): JobResult[] {
  return jobs
    .map(job => {
      let score = 0;

      // Veteran preference/friendly
      if (job.veteranPreference) score += 100;
      if (job.veteranFriendly) score += 50;

      // Security clearance (veterans often have this)
      if (job.securityClearance && job.securityClearance !== "none") score += 30;

      // Keywords in description
      const desc = job.description.toLowerCase();
      if (desc.includes("veteran")) score += 40;
      if (desc.includes("military")) score += 30;
      if (desc.includes("clearance")) score += 20;
      if (desc.includes("leadership")) score += 15;
      if (desc.includes("security")) score += 10;

      // Government/defense (good for veterans)
      if (job.source === "usajobs") score += 60;
      if (job.company.toLowerCase().includes("defense")) score += 25;
      if (job.company.toLowerCase().includes("government")) score += 25;

      return { ...job, _score: score };
    })
    .sort((a: any, b: any) => b._score - a._score)
    .map(({ _score, ...job }) => job); // Remove score from final result
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "software engineer";
  const location = searchParams.get("location") || "United States";
  const veteranFriendly = searchParams.get("veteran_friendly") === "true";

  try {
    let allJobs: JobResult[] = [];
    const sources: string[] = [];

    // Fetch from all available sources in parallel
    const results = await Promise.allSettled([
      fetchUSAJobs(query, location),
      fetchJSearch(query, location),
      fetchAdzuna(query, location.toLowerCase()),
      fetchRemoteOK(query),
    ]);

    // Combine results from all sources
    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.length > 0) {
        allJobs = [...allJobs, ...result.value];
        const sourceNames = ["usajobs", "jsearch", "adzuna", "remoteok"];
        sources.push(sourceNames[index]);
      }
    });

    // If no results from APIs, use enhanced mock data
    if (allJobs.length === 0) {
      console.log("Using enhanced mock job data");
      allJobs = getEnhancedMockJobs();
      sources.push("mock");
    }

    // Filter by veteran-friendly if requested
    if (veteranFriendly) {
      allJobs = allJobs.filter(job => job.veteranFriendly || job.veteranPreference);
    }

    // Deduplicate jobs
    allJobs = deduplicateJobs(allJobs);

    // Score and sort by veteran relevance
    allJobs = scoreJobsForVeterans(allJobs);

    // Limit to top 50 most relevant jobs
    allJobs = allJobs.slice(0, 50);

    return NextResponse.json({
      data: allJobs,
      total: allJobs.length,
      metadata: {
        sources: sources.length > 0 ? sources : ["mock"],
        query,
        location,
        veteranFriendly,
        timestamp: new Date().toISOString(),
        message: sources.length === 0
          ? "Add API keys for real job data - see API_SETUP_GUIDE.md"
          : `Showing ${allJobs.length} jobs from ${sources.join(", ")}`,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    // Return enhanced mock data on error
    const mockJobs = getEnhancedMockJobs();
    return NextResponse.json({
      data: mockJobs,
      total: mockJobs.length,
      metadata: {
        sources: ["mock (error fallback)"],
        error: "API error, using enhanced mock data",
        timestamp: new Date().toISOString(),
      },
    });
  }
}
