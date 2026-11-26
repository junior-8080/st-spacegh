"use client";

import { ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader, inputClass } from "@/components/ui/Field";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { apiFetch, useApi } from "@/lib/api-client";
import { WEBSITE_URL } from "@/lib/env";
import { formatDate } from "@/lib/format";
import type { Paginated, PostDTO } from "@/lib/types";

const TABS = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

type StatusFilter = (typeof TABS)[number]["value"];

export function PostsTable() {
  const toast = useToast();
  const [status, setStatus] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<PostDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  if (query) params.set("search", query);
  const { data, error, loading, reload } = useApi<Paginated<PostDTO>>(`/api/admin/posts?${params}`);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/posts/${toDelete.id}`, { method: "DELETE" });
      toast.success(`"${toDelete.title}" was deleted`);
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the post");
    } finally {
      setDeleting(false);
    }
  }

  const posts = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Blog Posts"
        description="Write, publish and manage articles for the website blog."
        actions={
          <Link href="/dashboard/posts/new" className={buttonClass("primary")}>
            <Plus className="size-4" aria-hidden /> New Post
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          label="Filter by status"
          tabs={TABS}
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
        <form
          role="search"
          className="relative sm:w-72"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(search.trim());
            setPage(1);
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            type="search"
            aria-label="Search posts"
            placeholder="Search posts… (press Enter)"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              if (!event.target.value) setQuery("");
            }}
            className={`${inputClass} pl-9`}
          />
        </form>
      </div>

      <DataTable
        columns={["Title", "Category", "Status", "Published", "Updated", "Actions"]}
        loading={loading && !data}
        error={error && !data ? error : undefined}
        empty={
          data && !posts.length ? (
            <>
              No posts found.{" "}
              <Link href="/dashboard/posts/new" className="font-semibold text-brand-gold-ink hover:underline">
                Write your first post
              </Link>
            </>
          ) : null
        }
        footer={data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}
      >
        {posts.map((post) => (
          <tr key={post.id} className="hover:bg-neutral-50">
            <td className="max-w-xs px-4 py-3">
              <Link href={`/dashboard/posts/${post.id}/edit`} className="font-semibold text-neutral-900 hover:text-brand-gold-ink">
                {post.title}
              </Link>
              <p className="truncate text-xs text-neutral-500">/{post.slug}</p>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{post.category}</td>
            <td className="px-4 py-3">
              <StatusBadge status={post.status} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{formatDate(post.publishedAt)}</td>
            <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{formatDate(post.updatedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  aria-label={`Edit ${post.title}`}
                  title="Edit"
                >
                  <Pencil className="size-4" />
                </Link>
                {post.status === "published" && (
                  <a
                    href={`${WEBSITE_URL}/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label={`View ${post.title} on the website`}
                    title="View on site"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setToDelete(post)}
                  className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${post.title}`}
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete this post?"
        message={`"${toDelete?.title ?? ""}" will be permanently removed from the website. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
