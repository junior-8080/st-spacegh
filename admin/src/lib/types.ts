import type {
  EmploymentType,
  FacilityStatus,
  FacilityType,
  PricePeriod,
  ExperienceLevel,
  JobLocation,
  JobStatus,
  PostCategory,
  PostStatus,
} from "@/lib/constants";

/** JSON shapes returned by the API, as seen by client components. */
export type PostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  category: PostCategory;
  tags: string[];
  author: string;
  status: PostStatus;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type JobDTO = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: JobLocation;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel | "";
  salary: string;
  summary: string;
  description?: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationEmail: string;
  applicationWhatsapp: string;
  applicationInstructions: string;
  deadline: string | null;
  status: JobStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessageDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type FacilityDTO = {
  id: string;
  name: string;
  slug: string;
  type: FacilityType;
  location: string;
  summary: string;
  description?: string;
  features: string[];
  images: string[];
  price: number | null;
  pricePeriod: PricePeriod;
  featured: boolean;
  status: FacilityStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  publishedPosts: number;
  draftPosts: number;
  openJobs: number;
  closedJobs: number;
  unreadMessages: number;
  publishedFacilities: number;
};

export type ApiResponse<T> = { data: T };
export type Paginated<T> = { data: T[]; total: number; page: number; totalPages: number };
