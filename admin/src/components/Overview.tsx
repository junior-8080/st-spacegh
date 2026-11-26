"use client";

import { Briefcase, Building2, FileCheck2, FilePen, FolderClosed, Mail, Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useApi } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { ApiResponse, JobDTO, Paginated, PostDTO, Stats } from "@/lib/types";

const STAT_CARDS: Array<{ key: keyof Stats; label: string; icon: LucideIcon; href: string }> = [
  { key: "publishedPosts", label: "Published posts", icon: FileCheck2, href: "/dashboard/posts" },
  { key: "draftPosts", label: "Draft posts", icon: FilePen, href: "/dashboard/posts" },
  { key: "openJobs", label: "Open jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { key: "closedJobs", label: "Closed jobs", icon: FolderClosed, href: "/dashboard/jobs" },
  { key: "publishedFacilities", label: "Facilities listed", icon: Building2, href: "/dashboard/facilities" },
  { key: "unreadMessages", label: "Unread messages", icon: Mail, href: "/dashboard/messages" },
];

export function Overview() {
  const stats = useApi<ApiResponse<Stats>>("/api/admin/stats");
  const posts = useApi<Paginated<PostDTO>>("/api/admin/posts?limit=5");
  const jobs = useApi<Paginated<JobDTO>>("/api/admin/jobs?limit=5");

  return (
    <>
      <PageHeader
        title="Overview"
        description="A snapshot of your website content and enquiries."
        actions={
          <>
            <Link href="/dashboard/posts/new" className={buttonClass("primary")}>
              <Plus className="size-4" aria-hidden /> New Blog Post
            </Link>
            <Link href="/dashboard/jobs/new" className={buttonClass("dark")}>
              <Plus className="size-4" aria-hidden /> New Job Vacancy
            </Link>
            <Link href="/dashboard/facilities/new" className={buttonClass("secondary")}>
              <Plus className="size-4" aria-hidden /> New Facility
            </Link>
          </>
        }
      />

      {stats.error && <p className="mb-4 text-sm text-red-600">Could not load stats: {stats.error}</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg border border-brand-gold/40 bg-brand-black text-brand-gold">
              <card.icon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 font-heading text-3xl font-extrabold text-neutral-900">
              {stats.data ? stats.data.data[card.key] : <span className="inline-block h-8 w-10 animate-pulse rounded bg-neutral-100" />}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Recent blog posts">
          <RecentList
            loading={posts.loading && !posts.data}
            empty="No posts yet."
            items={(posts.data?.data ?? []).map((post) => ({
              id: post.id,
              title: post.title,
              href: `/dashboard/posts/${post.id}/edit`,
              status: post.status,
              meta: `Updated ${formatDate(post.updatedAt)}`,
            }))}
          />
        </Card>
        <Card title="Recent job vacancies">
          <RecentList
            loading={jobs.loading && !jobs.data}
            empty="No job vacancies yet."
            items={(jobs.data?.data ?? []).map((job) => ({
              id: job.id,
              title: job.title,
              href: `/dashboard/jobs/${job.id}/edit`,
              status: job.status,
              meta: `${job.location} · Deadline ${formatDate(job.deadline, "none")}`,
            }))}
          />
        </Card>
      </div>
    </>
  );
}

type RecentItem = { id: string; title: string; href: string; status: string; meta: string };

function RecentList({ items, loading, empty }: { items: RecentItem[]; loading: boolean; empty: string }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-neutral-100" />
        ))}
      </div>
    );
  }
  if (!items.length) return <p className="text-sm text-neutral-500">{empty}</p>;
  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={item.href} className="flex items-center justify-between gap-4 py-3 hover:text-brand-gold-ink">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-neutral-900">{item.title}</span>
              <span className="block text-xs text-neutral-500">{item.meta}</span>
            </span>
            <StatusBadge status={item.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
