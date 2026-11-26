"use client";

import Link from "next/link";
import { FacilityForm } from "@/components/facilities/FacilityForm";
import { JobForm } from "@/components/jobs/JobForm";
import { PostForm } from "@/components/posts/PostForm";
import { useApi } from "@/lib/api-client";
import type { ApiResponse, FacilityDTO, JobDTO, PostDTO } from "@/lib/types";

const SECTIONS = { post: "posts", job: "jobs", facility: "facilities" } as const;

/** Loads a post, job or facility by id, then renders its editor. */
export function EditLoader({ kind, id }: { kind: keyof typeof SECTIONS; id: string }) {
  const section = SECTIONS[kind];
  const { data, error } = useApi<ApiResponse<PostDTO | JobDTO | FacilityDTO>>(`/api/admin/${section}/${id}`);

  if (error) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <p className="font-semibold text-neutral-900">{error}</p>
        <Link href={`/dashboard/${section}`} className="mt-3 inline-block text-sm font-semibold text-brand-gold-ink hover:underline">
          Back to the list
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="h-64 animate-pulse rounded-xl bg-white" />
        <div className="h-96 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  if (kind === "post") return <PostForm key={data.data.id} post={data.data as PostDTO} />;
  if (kind === "job") return <JobForm key={data.data.id} job={data.data as JobDTO} />;
  return <FacilityForm key={data.data.id} facility={data.data as FacilityDTO} />;
}
