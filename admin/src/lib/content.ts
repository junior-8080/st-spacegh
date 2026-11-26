import type { HydratedDocument } from "mongoose";
import { COMPANY_EMAIL, DEFAULT_AUTHOR } from "@/lib/constants";
import { escapeRegex } from "@/lib/http";
import { uniqueSlug } from "@/lib/slug";
import type { FacilityInput, JobInput, PostInput } from "@/lib/validators";
import { Facility, type IFacility } from "@/models/Facility";
import { Job, type IJob } from "@/models/Job";
import { Post, type IPost } from "@/models/Post";
import { deleteImages } from "@/lib/r2";

function toDate(value: JobInput["deadline"]): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return new Date(value);
}

/** Start of the current day in UTC; a job stays open through its deadline day. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function searchFilter(search: string | null, fields: string[]): Record<string, unknown> {
  const term = search?.trim();
  if (!term) return {};
  const regex = new RegExp(escapeRegex(term), "i");
  return { $or: fields.map((field) => ({ [field]: regex })) };
}

export async function createPost(input: PostInput): Promise<HydratedDocument<IPost>> {
  const status = input.status ?? "draft";
  return Post.create({
    ...input,
    slug: await uniqueSlug(Post, input.slug || input.title),
    author: input.author || DEFAULT_AUTHOR,
    status,
    publishedAt: status === "published" ? new Date() : null,
  });
}

export async function updatePost(post: HydratedDocument<IPost>, input: Partial<PostInput>): Promise<void> {
  const { slug, ...rest } = input;
  post.set(rest);
  if (input.author === "") post.author = DEFAULT_AUTHOR;
  if (slug !== undefined && slug !== post.slug) {
    post.slug = await uniqueSlug(Post, slug || post.title, post._id);
  }
  if (post.status === "published" && !post.publishedAt) post.publishedAt = new Date();
  await post.save();
}

export async function createJob(input: JobInput): Promise<HydratedDocument<IJob>> {
  const status = input.status ?? "draft";
  return Job.create({
    ...input,
    slug: await uniqueSlug(Job, input.slug || input.title),
    applicationEmail: input.applicationEmail || COMPANY_EMAIL,
    deadline: toDate(input.deadline) ?? null,
    status,
    publishedAt: status === "draft" ? null : new Date(),
  });
}

export async function updateJob(job: HydratedDocument<IJob>, input: Partial<JobInput>): Promise<void> {
  const { slug, deadline, ...rest } = input;
  job.set(rest);
  if (input.applicationEmail === "") job.applicationEmail = COMPANY_EMAIL;
  const parsedDeadline = toDate(deadline);
  if (parsedDeadline !== undefined) job.deadline = parsedDeadline;
  if (slug !== undefined && slug !== job.slug) {
    job.slug = await uniqueSlug(Job, slug || job.title, job._id);
  }
  if (job.status !== "draft" && !job.publishedAt) job.publishedAt = new Date();
  await job.save();
}

export async function createFacility(input: FacilityInput): Promise<HydratedDocument<IFacility>> {
  const status = input.status ?? "draft";
  return Facility.create({
    ...input,
    slug: await uniqueSlug(Facility, input.slug || input.name),
    status,
    publishedAt: status === "published" ? new Date() : null,
  });
}

export async function updateFacility(facility: HydratedDocument<IFacility>, input: Partial<FacilityInput>): Promise<void> {
  const { slug, ...rest } = input;
  const removedImages = input.images ? facility.images.filter((image) => !input.images?.includes(image)) : [];
  facility.set(rest);
  if (slug !== undefined && slug !== facility.slug) {
    facility.slug = await uniqueSlug(Facility, slug || facility.name, facility._id);
  }
  if (facility.status === "published" && !facility.publishedAt) facility.publishedAt = new Date();
  await facility.save();
  // Best effort: a storage hiccup must not fail an otherwise successful save.
  await deleteImages(removedImages).catch((error) => console.error("R2 delete failed", error));
}
