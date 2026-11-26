"use client";

import { BriefcaseBusiness, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import type { JobSummary } from "@/types";

const selectClass =
  "h-11 w-full rounded-sm border border-neutral-300 bg-white px-3 text-sm font-medium text-brand-black focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30";

/** A job based in "Accra & Kumasi" also matches the "Accra" and "Kumasi" filters. */
function matchesLocation(jobLocation: string, filter: string): boolean {
  if (!filter || jobLocation === filter) return true;
  return jobLocation === "Accra & Kumasi" && (filter === "Accra" || filter === "Kumasi");
}

/** Job list with client-side location and employment-type filters. */
export function JobsBrowser({ jobs, email }: { jobs: JobSummary[]; email: string }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const locations = useMemo(() => [...new Set(jobs.map((job) => job.location))].sort(), [jobs]);
  const types = useMemo(() => [...new Set(jobs.map((job) => job.employmentType))].sort(), [jobs]);
  const filtered = jobs.filter((job) => matchesLocation(job.location, location) && (!type || job.employmentType === type));

  if (!jobs.length) {
    return (
      <div className="mx-auto max-w-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
        <BriefcaseBusiness className="mx-auto size-12 text-brand-gold-dark" strokeWidth={1.25} aria-hidden />
        <h2 className="mt-5 font-heading text-xl font-extrabold uppercase text-brand-black">No open positions right now</h2>
        <p className="mt-3 text-neutral-600">
          No open positions right now. Check back soon or send your CV to{" "}
          <a href={`mailto:${email}`} className="font-semibold text-brand-black underline decoration-brand-gold decoration-2 underline-offset-4">
            {email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end sm:p-5">
        <p className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-brand-black sm:mb-3 sm:mr-4">
          <SlidersHorizontal className="size-4 text-brand-gold-dark" aria-hidden /> Filter
        </p>
        <div className="flex-1">
          <label htmlFor="filter-location" className="mb-1.5 block text-xs font-semibold text-neutral-600">
            Location
          </label>
          <select id="filter-location" value={location} onChange={(event) => setLocation(event.target.value)} className={selectClass}>
            <option value="">All locations</option>
            {locations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="filter-type" className="mb-1.5 block text-xs font-semibold text-neutral-600">
            Employment type
          </label>
          <select id="filter-type" value={type} onChange={(event) => setType(event.target.value)} className={selectClass}>
            <option value="">All types</option>
            {types.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-8 text-sm text-neutral-600" aria-live="polite">
        Showing <strong className="text-brand-black">{filtered.length}</strong> of {jobs.length} open position{jobs.length === 1 ? "" : "s"}
      </p>

      {filtered.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-neutral-300 bg-white px-6 py-12 text-center text-neutral-600">
          No positions match these filters.{" "}
          <button
            type="button"
            onClick={() => {
              setLocation("");
              setType("");
            }}
            className="font-semibold text-brand-black underline decoration-brand-gold decoration-2 underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
