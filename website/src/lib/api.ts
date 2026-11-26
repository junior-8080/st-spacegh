import type { Facility, FacilitySummary, FacilityType, Job, JobSummary, Paginated, Post, PostCategory, PostSummary } from "@/types";

export const ADMIN_API_URL = (process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

const REVALIDATE_SECONDS = 60;

/**
 * GETs a public admin API route. Never throws: returns null when the API is
 * unreachable or responds with an error, so the website keeps working.
 */
async function getJson<T>(path: string, tag: "posts" | "jobs" | "facilities"): Promise<T | null> {
  try {
    const response = await fetch(`${ADMIN_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

const emptyPage = <T>(page = 1): Paginated<T> => ({ data: [], total: 0, page, totalPages: 1 });

export async function getPosts(
  options: { category?: PostCategory; page?: number; limit?: number } = {},
): Promise<Paginated<PostSummary>> {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  const result = await getJson<Paginated<PostSummary>>(`/api/public/posts?${params}`, "posts");
  return result ?? emptyPage(options.page);
}

export async function getPost(slug: string): Promise<Post | null> {
  const result = await getJson<{ data: Post }>(`/api/public/posts/${encodeURIComponent(slug)}`, "posts");
  return result?.data ?? null;
}

export async function getJobs(): Promise<JobSummary[]> {
  const result = await getJson<{ data: JobSummary[] }>("/api/public/jobs", "jobs");
  return result?.data ?? [];
}

export async function getJob(slug: string): Promise<Job | null> {
  const result = await getJson<{ data: Job }>(`/api/public/jobs/${encodeURIComponent(slug)}`, "jobs");
  return result?.data ?? null;
}

/** All published post slugs, for the sitemap. */
export async function getAllPosts(): Promise<PostSummary[]> {
  const first = await getPosts({ limit: 50 });
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) => getPosts({ limit: 50, page: i + 2 })),
  );
  return [first, ...rest].flatMap((page) => page.data);
}

export async function getFacilities(options: { type?: FacilityType } = {}): Promise<FacilitySummary[]> {
  const params = new URLSearchParams();
  if (options.type) params.set("type", options.type);
  const result = await getJson<{ data: FacilitySummary[] }>(`/api/public/facilities?${params}`, "facilities");
  return result?.data ?? [];
}

export async function getFacility(slug: string): Promise<Facility | null> {
  const result = await getJson<{ data: Facility }>(`/api/public/facilities/${encodeURIComponent(slug)}`, "facilities");
  return result?.data ?? null;
}
