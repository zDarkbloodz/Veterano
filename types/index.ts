// ============================================
// JOB TYPES
// ============================================

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  experience: ExperienceLevel;
  salary?: SalaryRange;
  description: string;
  requirements: string[];
  benefits: string[];
  veteranFriendly: boolean;
  veteranPreference: boolean;
  securityClearance?: SecurityClearance;
  postedAt: Date;
  expiresAt: Date;
  applyUrl: string;
  source: 'indeed' | 'manual';
  tags: string[];
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type SecurityClearance = 'none' | 'confidential' | 'secret' | 'top-secret';

export interface SalaryRange {
  min: number;
  max: number;
  currency: 'USD';
  period: 'yearly' | 'hourly';
}

// ============================================
// RESUME TYPES
// ============================================

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  parsedContent: ParsedResume;
  aiAnalysis?: ResumeAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  militaryService?: MilitaryService;
}

export interface WorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  field?: string;
  startDate?: Date;
  endDate?: Date;
  gpa?: number;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export type SkillCategory =
  | 'programming'
  | 'framework'
  | 'tool'
  | 'soft-skill'
  | 'military-skill';

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface MilitaryService {
  branch: MilitaryBranch;
  rank: string;
  mos: string; // Military Occupational Specialty
  startDate: Date;
  endDate?: Date;
  honorableDischarge: boolean;
  securityClearance?: SecurityClearance;
}

export type MilitaryBranch = 'army' | 'navy' | 'air-force' | 'marines' | 'coast-guard' | 'space-force';

// ============================================
// AI ANALYSIS TYPES
// ============================================

export interface ResumeAnalysis {
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  suggestions: Suggestion[];
  skillGaps: SkillGap[];
  keywordMatch: KeywordMatch;
  atsScore: number; // ATS-friendliness score
  civilianTranslation: CivilianTranslation;
}

export interface Suggestion {
  category: 'formatting' | 'content' | 'skills' | 'experience' | 'keywords';
  severity: 'critical' | 'important' | 'minor';
  title: string;
  description: string;
  example?: string;
}

export interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  commonIn: string[]; // Common in these job roles
  learningResources: string[];
}

export interface KeywordMatch {
  matched: string[];
  missing: string[];
  score: number;
}

export interface CivilianTranslation {
  militaryTerms: Array<{
    military: string;
    civilian: string;
    context: string;
  }>;
  translatedExperience: WorkExperience[];
}

// ============================================
// COMPANY TYPES
// ============================================

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description: string;
  size: CompanySize;
  industry: string;
  veteranFriendly: boolean;
  veteranPrograms: VeteranProgram[];
  benefits: string[];
  culture: string;
  locations: string[];
  jobCount: number;
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface VeteranProgram {
  name: string;
  description: string;
  type: 'hiring' | 'training' | 'mentorship' | 'networking';
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  veteranStatus: VeteranStatus;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'veteran' | 'employer' | 'admin';

export interface VeteranStatus {
  isVeteran: boolean;
  branch?: MilitaryBranch;
  yearsServed?: number;
  hasDisability?: boolean;
  securityClearance?: SecurityClearance;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  preferredLocation?: string[];
  jobPreferences: JobPreferences;
  savedJobs: string[];
  appliedJobs: string[];
}

export interface JobPreferences {
  types: JobType[];
  experienceLevels: ExperienceLevel[];
  remote: boolean;
  salaryMin?: number;
  industries: string[];
}

// ============================================
// UTILITY TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchFilters {
  query?: string;
  location?: string;
  type?: JobType[];
  experience?: ExperienceLevel[];
  veteranFriendly?: boolean;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
}
