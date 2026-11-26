export type PostCategory = "News" | "Tips & Guides" | "Company Updates" | "Industry Insights";

export const POST_CATEGORIES: PostCategory[] = ["News", "Tips & Guides", "Company Updates", "Industry Insights"];

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: PostCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type Post = PostSummary & { content: string };

export type JobLocation = "Accra" | "Kumasi" | "Accra & Kumasi" | "Remote";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary";

export type JobSummary = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: JobLocation;
  employmentType: EmploymentType;
  experienceLevel: "Entry" | "Mid" | "Senior" | "";
  salary: string;
  summary: string;
  applicationEmail: string;
  applicationWhatsapp: string;
  deadline: string | null;
  status: "open" | "closed";
  publishedAt: string;
  updatedAt: string;
};

export type Job = JobSummary & {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationInstructions: string;
};

export type Paginated<T> = { data: T[]; total: number; page: number; totalPages: number };

export type FacilityType =
  | "Office"
  | "Residential"
  | "Commercial / Retail"
  | "Industrial / Warehouse"
  | "Hospitality"
  | "Educational"
  | "Healthcare"
  | "Mixed-use";

export const FACILITY_TYPES: FacilityType[] = [
  "Office",
  "Residential",
  "Commercial / Retail",
  "Industrial / Warehouse",
  "Hospitality",
  "Educational",
  "Healthcare",
  "Mixed-use",
];

export type FacilitySummary = {
  id: string;
  name: string;
  slug: string;
  type: FacilityType;
  location: string;
  summary: string;
  features: string[];
  /** Public image URLs (Cloudflare R2); the first is the cover. */
  images: string[];
  price: number | null;
  pricePeriod: string;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
};

export type Facility = FacilitySummary & { description: string };
