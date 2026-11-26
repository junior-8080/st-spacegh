import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  FACILITY_STATUSES,
  FACILITY_TYPES,
  MAX_FACILITY_IMAGES,
  PRICE_PERIODS,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
  JOB_STATUSES,
  POST_CATEGORIES,
  POST_STATUSES,
} from "@/lib/constants";

const slugField = z
  .string()
  .trim()
  .max(120)
  .regex(/^([a-z0-9]+(?:-[a-z0-9]+)*)?$/, { error: "Use lowercase letters, numbers and hyphens only" });

const optionalText = (max: number) => z.string().trim().max(max, { error: `Must be ${max} characters or fewer` });

const stringList = z.array(z.string().trim().min(1).max(500)).max(30);

/** Accepts "", null, "YYYY-MM-DD" or a full ISO datetime. */
const optionalDate = z.union([z.iso.date(), z.iso.datetime(), z.literal(""), z.null()]);

export const postSchema = z.object({
  title: z.string().trim().min(3, { error: "Title must be at least 3 characters" }).max(200),
  slug: slugField.optional(),
  excerpt: optionalText(300).optional(),
  content: z.string().trim().min(1, { error: "Content is required" }),
  coverImage: z.union([z.url({ protocol: /^https?$/, error: "Enter a valid http(s) URL" }), z.literal("")]).optional(),
  category: z.enum(POST_CATEGORIES, { error: "Choose a category" }),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  author: optionalText(100).optional(),
  status: z.enum(POST_STATUSES).optional(),
  seoTitle: optionalText(70).optional(),
  seoDescription: optionalText(160).optional(),
});
export const postUpdateSchema = postSchema.partial();
export type PostInput = z.infer<typeof postSchema>;

export const jobSchema = z.object({
  title: z.string().trim().min(3, { error: "Title must be at least 3 characters" }).max(150),
  slug: slugField.optional(),
  department: z.string().trim().min(2, { error: "Department is required" }).max(80),
  location: z.enum(JOB_LOCATIONS, { error: "Choose a location" }),
  employmentType: z.enum(EMPLOYMENT_TYPES, { error: "Choose an employment type" }),
  experienceLevel: z.union([z.enum(EXPERIENCE_LEVELS), z.literal("")]).optional(),
  salary: optionalText(100).optional(),
  summary: z.string().trim().min(10, { error: "Summary must be at least 10 characters" }).max(300),
  description: optionalText(20000).optional(),
  responsibilities: stringList.optional(),
  requirements: stringList.optional(),
  benefits: stringList.optional(),
  applicationEmail: z.union([z.email({ error: "Enter a valid email" }), z.literal("")]).optional(),
  applicationWhatsapp: optionalText(30).optional(),
  applicationInstructions: optionalText(2000).optional(),
  deadline: optionalDate.optional(),
  status: z.enum(JOB_STATUSES).optional(),
});
export const jobUpdateSchema = jobSchema.partial();
export type JobInput = z.infer<typeof jobSchema>;

/** Image URL (uploaded to Cloudflare R2 through the admin). */
const imageRef = z.url({ protocol: /^https?$/, error: "Invalid image URL" });

export const facilitySchema = z.object({
  name: z.string().trim().min(3, { error: "Name must be at least 3 characters" }).max(150),
  slug: slugField.optional(),
  type: z.enum(FACILITY_TYPES, { error: "Choose a facility type" }),
  location: z.string().trim().min(2, { error: "Location is required" }).max(150),
  summary: optionalText(300).optional(),
  description: optionalText(20000).optional(),
  features: stringList.optional(),
  images: z.array(imageRef).max(MAX_FACILITY_IMAGES, { error: `Up to ${MAX_FACILITY_IMAGES} images` }).optional(),
  price: z.number({ error: "Enter a valid amount" }).nonnegative({ error: "Price cannot be negative" }).max(1_000_000_000).nullable().optional(),
  pricePeriod: z.enum(PRICE_PERIODS).optional(),
  featured: z.boolean().optional(),
  status: z.enum(FACILITY_STATUSES).optional(),
});
export const facilityUpdateSchema = facilitySchema.partial();
export type FacilityInput = z.infer<typeof facilitySchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Please enter your name" }).max(100),
  email: z.email({ error: "Please enter a valid email" }).max(200),
  phone: z.string().trim().min(7, { error: "Please enter a valid phone number" }).max(30),
  company: optionalText(150).optional(),
  service: optionalText(100).optional(),
  message: z.string().trim().min(10, { error: "Message must be at least 10 characters" }).max(5000),
  /** Honeypot: must stay empty. */
  website: z.string().optional(),
});

export const messageUpdateSchema = z.object({ read: z.boolean() });

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email" }),
  password: z.string().min(1, { error: "Password is required" }),
});

/** Converts zod issues to a flat `{ field: message }` map for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    result[key] ??= issue.message;
  }
  return result;
}
