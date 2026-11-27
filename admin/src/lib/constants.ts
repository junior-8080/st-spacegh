export const POST_CATEGORIES = ["News", "Tips & Guides", "Company Updates", "Industry Insights"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const JOB_LOCATIONS = ["Accra", "Kumasi", "Accra & Kumasi", "Remote"] as const;
export type JobLocation = (typeof JOB_LOCATIONS)[number];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const SERVICE_OPTIONS = [
  "Facility Management",
  "Asset & Property Management",
  "Project & Support Services",
  "Fumigation",
  "Other",
] as const;

export const FACILITY_TYPES = [
  "Office",
  "Residential",
  "Commercial / Retail",
  "Industrial / Warehouse",
  "Hospitality",
  "Educational",
  "Healthcare",
  "Mixed-use",
] as const;
export type FacilityType = (typeof FACILITY_TYPES)[number];

export const FACILITY_STATUSES = ["draft", "published"] as const;
export type FacilityStatus = (typeof FACILITY_STATUSES)[number];

export const PRICE_PERIODS = ["", "per month", "per year", "per day", "per sq m", "one-off","2hrs","1hr", "30mins","3hrs"] as const;
export type PricePeriod = (typeof PRICE_PERIODS)[number];

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit
export const MAX_FACILITY_IMAGES = 12;

export const COMPANY_EMAIL = "info@st-spacegh.com";
export const DEFAULT_AUTHOR = "ST-SPACE Team";
export const SESSION_COOKIE = "st_admin_session";
export const ADMIN_PAGE_SIZE = 10;

/** Type guard: narrows a query-string value to one of the allowed enum values. */
export function isOneOf<T extends string>(list: readonly T[], value: string | null): value is T {
  return value !== null && (list as readonly string[]).includes(value);
}
