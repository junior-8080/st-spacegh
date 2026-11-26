"use client";

import { ExternalLink, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/Field";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { apiFetch, useApi } from "@/lib/api-client";
import { WEBSITE_URL } from "@/lib/env";
import { formatDate, isPast } from "@/lib/format";
import type { JobDTO, Paginated } from "@/lib/types";

const TABS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Closed" },
] as const;

type StatusFilter = (typeof TABS)[number]["value"];

export function JobsTable() {
  const toast = useToast();
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<JobDTO | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  const { data, error, loading, reload } = useApi<Paginated<JobDTO>>(`/api/admin/jobs?${params}`);

  async function closeJob(job: JobDTO) {
    setBusyId(job.id);
    try {
      await apiFetch(`/api/admin/jobs/${job.id}`, { method: "PATCH", json: { status: "closed" } });
      toast.success(`"${job.title}" is now closed`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not close the position");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      await apiFetch(`/api/admin/jobs/${toDelete.id}`, { method: "DELETE" });
      toast.success(`"${toDelete.title}" was deleted`);
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the job");
    } finally {
      setBusyId(null);
    }
  }

  const jobs = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Job Vacancies"
        description="Post openings to the careers page and manage their status."
        actions={
          <Link href="/dashboard/jobs/new" className={buttonClass("primary")}>
            <Plus className="size-4" aria-hidden /> New Vacancy
          </Link>
        }
      />

      <div className="mb-4">
        <FilterTabs
          label="Filter by status"
          tabs={TABS}
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      </div>

      <DataTable
        columns={["Title", "Location", "Type", "Deadline", "Status", "Actions"]}
        loading={loading && !data}
        error={error && !data ? error : undefined}
        empty={
          data && !jobs.length ? (
            <>
              No job vacancies found.{" "}
              <Link href="/dashboard/jobs/new" className="font-semibold text-brand-gold-ink hover:underline">
                Create one
              </Link>
            </>
          ) : null
        }
        footer={data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}
      >
        {jobs.map((job) => {
          const expired = job.status === "open" && isPast(job.deadline);
          return (
            <tr key={job.id} className="hover:bg-neutral-50">
              <td className="max-w-xs px-4 py-3">
                <Link href={`/dashboard/jobs/${job.id}/edit`} className="font-semibold text-neutral-900 hover:text-brand-gold-ink">
                  {job.title}
                </Link>
                <p className="truncate text-xs text-neutral-500">{job.department}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{job.location}</td>
              <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{job.employmentType}</td>
              <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                {formatDate(job.deadline, "No deadline")}
                {expired && <span className="ml-2 text-xs font-semibold text-red-600">Passed</span>}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {job.status === "open" && (
                    <button
                      type="button"
                      onClick={() => closeJob(job)}
                      disabled={busyId === job.id}
                      className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
                    >
                      <Lock className="size-3.5" aria-hidden /> Close position
                    </button>
                  )}
                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label={`Edit ${job.title}`}
                    title="Edit"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  {job.status !== "draft" && (
                    <a
                      href={`${WEBSITE_URL}/careers/${job.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label={`View ${job.title} on the website`}
                      title="View on site"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setToDelete(job)}
                    className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${job.title}`}
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete this job vacancy?"
        message={`"${toDelete?.title ?? ""}" will be permanently removed. Consider closing it instead so old links still work.`}
        loading={Boolean(toDelete && busyId === toDelete.id)}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
