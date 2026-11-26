"use client";

import { Building2, ExternalLink, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import Image from "next/image";
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
import { formatPrice } from "@/lib/format";
import type { FacilityDTO, Paginated } from "@/lib/types";

const TABS = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

type StatusFilter = (typeof TABS)[number]["value"];

export function FacilitiesTable() {
  const toast = useToast();
  const [status, setStatus] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<FacilityDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  if (query) params.set("search", query);
  const { data, error, loading, reload } = useApi<Paginated<FacilityDTO>>(`/api/admin/facilities?${params}`);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/facilities/${toDelete.id}`, { method: "DELETE" });
      toast.success(`"${toDelete.name}" was deleted`);
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the facility");
    } finally {
      setDeleting(false);
    }
  }

  const facilities = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Facilities"
        description="Properties and facilities you manage, shown on the website with photos and prices."
        actions={
          <Link href="/dashboard/facilities/new" className={buttonClass("primary")}>
            <Plus className="size-4" aria-hidden /> New Facility
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
            aria-label="Search facilities"
            placeholder="Search facilities… (press Enter)"
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
        columns={["Facility", "Type", "Price", "Status", "Actions"]}
        loading={loading && !data}
        error={error && !data ? error : undefined}
        empty={
          data && !facilities.length ? (
            <>
              No facilities yet.{" "}
              <Link href="/dashboard/facilities/new" className="font-semibold text-brand-gold-ink hover:underline">
                Add your first facility
              </Link>
            </>
          ) : null
        }
        footer={data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}
      >
        {facilities.map((facility) => (
          <tr key={facility.id} className="hover:bg-neutral-50">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-brand-black">
                  {facility.images[0] ? (
                    <Image src={facility.images[0]} alt="" fill unoptimized sizes="48px" className="object-cover" />
                  ) : (
                    <Building2 className="absolute inset-0 m-auto size-5 text-brand-gold" aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/facilities/${facility.id}/edit`}
                    className="flex items-center gap-1.5 font-semibold text-neutral-900 hover:text-brand-gold-ink"
                  >
                    {facility.name}
                    {facility.featured && <Star className="size-3.5 fill-brand-gold text-brand-gold" aria-label="Featured" />}
                  </Link>
                  <p className="truncate text-xs text-neutral-500">
                    {facility.location} · {facility.images.length} photo{facility.images.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{facility.type}</td>
            <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-800">
              {formatPrice(facility.price, facility.pricePeriod)}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={facility.status} />
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1">
                <Link
                  href={`/dashboard/facilities/${facility.id}/edit`}
                  className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  aria-label={`Edit ${facility.name}`}
                  title="Edit"
                >
                  <Pencil className="size-4" />
                </Link>
                {facility.status === "published" && (
                  <a
                    href={`${WEBSITE_URL}/facilities/${facility.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label={`View ${facility.name} on the website`}
                    title="View on site"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setToDelete(facility)}
                  className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${facility.name}`}
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
        title="Delete this facility?"
        message={`"${toDelete?.name ?? ""}" and its photos will be permanently removed from the website. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
