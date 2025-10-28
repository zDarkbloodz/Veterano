import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

const rssParser = new Parser();

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

// ============================================
// REAL DATA SOURCE 1: USAJobs API
// ============================================
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
        VeteranPreference: "true",
        ...(location && { LocationName: location }),
      },
      timeout: 10000,
    });

    const jobs = response.data.SearchResult?.SearchResultItems || [];

    return jobs.map((item: any) => {
      const job = item.MatchedObjectDescriptor;
      return {
        id: `usajobs-${job.PositionID}`,
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

// ============================================
// REAL DATA SOURCE 2: Remotive.io API (Remote Jobs)
// ============================================
async function fetchRemotive(query: string): Promise<JobResult[]> {
  try {
    const response = await axios.get("https://remotive.com/api/remote-jobs", {
      params: {
        search: query || "software",
        limit: 50,
      },
      timeout: 10000,
    });

    const jobs = response.data.jobs || [];

    return jobs.map((job: any) => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: "Remote",
      type: job.job_type || "full-time",
      experience: "mid",
      description: job.description || "",
      requirements: [],
      benefits: [],
      veteranFriendly: job.description?.toLowerCase().includes("veteran") || false,
      veteranPreference: false,
      securityClearance: "none",
      postedAt: new Date(job.publication_date),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: job.url,
      source: "remotive",
      tags: job.tags || [job.category],
      salary: job.salary ? { min: 0, max: 0 } : undefined,
    }));
  } catch (error) {
    console.error("Remotive API error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 3: Himalayas.app API
// ============================================
async function fetchHimalayas(): Promise<JobResult[]> {
  try {
    const response = await axios.get("https://himalayas.app/jobs/api", {
      timeout: 10000,
    });

    // Himalayas returns {jobs: [...]} or sometimes just an array
    const jobsData = response.data?.jobs || response.data;
    const jobs = Array.isArray(jobsData) ? jobsData : [];

    if (jobs.length === 0) {
      console.log("Himalayas API returned no jobs");
      return [];
    }

    return jobs.slice(0, 50).map((job: any) => ({
      id: `himalayas-${job.id || Date.now()}`,
      title: job.title || "Untitled Position",
      company: job.company?.name || job.company || "Unknown Company",
      location: job.location || "Remote",
      type: "full-time",
      experience: "mid",
      description: job.description || "",
      requirements: [],
      benefits: [],
      veteranFriendly: false,
      veteranPreference: false,
      securityClearance: "none",
      postedAt: new Date(job.pubDate || job.created_at || Date.now()),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: job.url || job.link || "",
      source: "himalayas",
      tags: [job.category || "tech"],
      salary: undefined,
    }));
  } catch (error) {
    console.error("Himalayas API error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 4: We Work Remotely RSS
// ============================================
async function fetchWeWorkRemotely(): Promise<JobResult[]> {
  try {
    const feed = await rssParser.parseURL("https://weworkremotely.com/categories/remote-programming-jobs.rss");

    return feed.items.slice(0, 30).map((item: any, index: number) => ({
      id: `wwr-${index}-${Date.now()}`,
      title: item.title || "Untitled Position",
      company: item.creator || "Unknown Company",
      location: "Remote",
      type: "full-time",
      experience: "mid",
      description: item.contentSnippet || item.content || "",
      requirements: [],
      benefits: [],
      veteranFriendly: false,
      veteranPreference: false,
      securityClearance: "none",
      postedAt: new Date(item.pubDate || Date.now()),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applyUrl: item.link || "",
      source: "weworkremotely",
      tags: ["remote", "programming"],
      salary: undefined,
    }));
  } catch (error) {
    console.error("We Work Remotely RSS error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 5: ClearanceJobs.com Scraping (VETERAN-FOCUSED!)
// ============================================
async function fetchClearanceJobs(query: string = "software"): Promise<JobResult[]> {
  try {
    // ClearanceJobs search URL
    const searchUrl = `https://www.clearancejobs.com/jobs?keywords=${encodeURIComponent(query)}&page=1`;

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const jobs: JobResult[] = [];

    // Parse job listings
    $(".job-search-result, .job-tile, .job-item").each((index, element) => {
      try {
        const $job = $(element);
        const title = $job.find(".job-title, h2, .title").first().text().trim();
        const company = $job.find(".company, .company-name, .employer").first().text().trim();
        const location = $job.find(".location, .job-location").first().text().trim();
        const clearance = $job.find(".clearance, .security-clearance").first().text().trim();
        const link = $job.find("a").first().attr("href");

        if (title && company) {
          jobs.push({
            id: `clearance-${index}-${Date.now()}`,
            title,
            company,
            location: location || "Various Locations",
            type: "full-time",
            experience: "mid",
            description: `Security clearance position. ${clearance ? `Clearance: ${clearance}` : ""}`,
            requirements: clearance ? [clearance] : [],
            benefits: ["Security Clearance Support", "Veteran Friendly"],
            veteranFriendly: true,
            veteranPreference: false,
            securityClearance: clearance.toLowerCase().includes("top") ? "top-secret" :
                              clearance.toLowerCase().includes("secret") ? "secret" : "confidential",
            postedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            applyUrl: link?.startsWith("http") ? link : `https://www.clearancejobs.com${link}`,
            source: "clearancejobs",
            tags: ["security-clearance", "veteran-friendly", clearance.toLowerCase()],
            salary: undefined,
          });
        }
      } catch (err) {
        // Skip invalid job entries
      }
    });

    return jobs.slice(0, 20);
  } catch (error) {
    console.error("ClearanceJobs scraping error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 6: JSearch API (LinkedIn, Indeed, Glassdoor aggregator)
// ============================================
async function fetchJSearch(query: string, location: string = "United States"): Promise<JobResult[]> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.log("RapidAPI (JSearch) not configured");
    return [];
  }

  try {
    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      params: {
        query: `${query} ${location}`,
        page: "1",
        num_pages: "1",
        date_posted: "month",
      },
      timeout: 10000,
    });

    const jobs = response.data.data || [];

    return jobs.slice(0, 20).map((job: any) => ({
      id: `jsearch-${job.job_id}`,
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
        ? { min: job.job_min_salary, max: job.job_max_salary }
        : undefined,
    }));
  } catch (error) {
    console.error("JSearch API error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 7: Adzuna API
// ============================================
async function fetchAdzuna(query: string, location: string = "us"): Promise<JobResult[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.log("Adzuna API not configured");
    return [];
  }

  try {
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/${location}/search/1`, {
      params: {
        app_id: appId,
        app_key: appKey,
        results_per_page: 50,
        what: query || "software engineer",
        what_or: "veteran IT technology software developer engineer",
      },
      timeout: 10000,
    });

    return response.data.results.map((job: any) => ({
      id: `adzuna-${job.id}`,
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
        ? { min: job.salary_min, max: job.salary_max }
        : undefined,
    }));
  } catch (error) {
    console.error("Adzuna API error:", error);
    return [];
  }
}

// ============================================
// REAL DATA SOURCE 8: RemoteOK API
// ============================================
async function fetchRemoteOK(query: string): Promise<JobResult[]> {
  try {
    const response = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Veterano Job Board (veterano.careers)",
      },
      timeout: 10000,
    });

    const jobs = response.data.slice(1); // First item is metadata
    const filteredJobs = query
      ? jobs.filter((job: any) =>
          job.position?.toLowerCase().includes(query.toLowerCase()) ||
          job.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
        )
      : jobs;

    return filteredJobs.slice(0, 20).map((job: any) => ({
      id: `remoteok-${job.id || job.slug}`,
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
        ? { min: job.salary_min, max: job.salary_max }
        : undefined,
    }));
  } catch (error) {
    console.error("RemoteOK API error:", error);
    return [];
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function deduplicateJobs(jobs: JobResult[]): JobResult[] {
  const seen = new Set<string>();
  return jobs.filter(job => {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreJobsForVeterans(jobs: JobResult[]): JobResult[] {
  return jobs
    .map(job => {
      let score = 0;
      if (job.veteranPreference) score += 100;
      if (job.veteranFriendly) score += 50;
      if (job.securityClearance && job.securityClearance !== "none") score += 30;

      const desc = job.description.toLowerCase();
      if (desc.includes("veteran")) score += 40;
      if (desc.includes("military")) score += 30;
      if (desc.includes("clearance")) score += 20;
      if (desc.includes("leadership")) score += 15;
      if (desc.includes("security")) score += 10;

      if (job.source === "usajobs") score += 60;
      if (job.source === "clearancejobs") score += 50;
      if (job.company.toLowerCase().includes("defense")) score += 25;
      if (job.company.toLowerCase().includes("government")) score += 25;

      return { ...job, _score: score };
    })
    .sort((a: any, b: any) => b._score - a._score)
    .map(({ _score, ...job }) => job);
}

// ============================================
// MAIN API ROUTE
// ============================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "software engineer";
  const location = searchParams.get("location") || "United States";
  const veteranFriendly = searchParams.get("veteran_friendly") === "true";

  try {
    let allJobs: JobResult[] = [];
    const sources: string[] = [];

    // Fetch from ALL real sources in parallel
    console.log("Fetching jobs from all sources...");

    const results = await Promise.allSettled([
      fetchUSAJobs(query, location),
      fetchClearanceJobs(query), // Veteran-focused!
      fetchRemotive(query),
      fetchWeWorkRemotely(),
      fetchHimalayas(),
      fetchJSearch(query, location),
      fetchAdzuna(query, location.toLowerCase()),
      fetchRemoteOK(query),
    ]);

    // Combine results from all sources
    const sourceNames = ["usajobs", "clearancejobs", "remotive", "weworkremotely", "himalayas", "jsearch", "adzuna", "remoteok"];

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.length > 0) {
        allJobs = [...allJobs, ...result.value];
        sources.push(sourceNames[index]);
        console.log(`✓ ${sourceNames[index]}: ${result.value.length} jobs`);
      } else if (result.status === "rejected") {
        console.log(`✗ ${sourceNames[index]}: failed`);
      }
    });

    console.log(`Total jobs fetched: ${allJobs.length} from ${sources.length} sources`);

    // If no real data available, return helpful error
    if (allJobs.length === 0) {
      return NextResponse.json({
        data: [],
        total: 0,
        metadata: {
          sources: [],
          error: "No job data available. Please add API keys to get real jobs.",
          message: "Add USAJOBS_API_KEY or RAPIDAPI_KEY to .env.local - See API_SETUP_GUIDE.md",
          timestamp: new Date().toISOString(),
        },
      }, { status: 200 });
    }

    // Filter by veteran-friendly if requested
    if (veteranFriendly) {
      allJobs = allJobs.filter(job => job.veteranFriendly || job.veteranPreference);
    }

    // Deduplicate jobs
    const beforeDedup = allJobs.length;
    allJobs = deduplicateJobs(allJobs);
    console.log(`Removed ${beforeDedup - allJobs.length} duplicates`);

    // Score and sort by veteran relevance
    allJobs = scoreJobsForVeterans(allJobs);

    // Limit to top 50 most relevant jobs
    allJobs = allJobs.slice(0, 50);

    return NextResponse.json({
      data: allJobs,
      total: allJobs.length,
      metadata: {
        sources,
        query,
        location,
        veteranFriendly,
        timestamp: new Date().toISOString(),
        message: `Found ${allJobs.length} real jobs from ${sources.join(", ")}`,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    return NextResponse.json({
      data: [],
      total: 0,
      metadata: {
        sources: [],
        error: "Failed to fetch jobs. Check server logs.",
        timestamp: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}
