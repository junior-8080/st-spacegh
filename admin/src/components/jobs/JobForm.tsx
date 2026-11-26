"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { ListInput, toListItems, type ListItem } from "@/components/editor/ListInput";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Button } from "@/components/ui/Button";
import { Card, Field, PageHeader, fieldA11y, inputClass } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { ApiError, apiFetch } from "@/lib/api-client";
import {
  COMPANY_EMAIL,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
  type EmploymentType,
  type ExperienceLevel,
  type JobLocation,
  type JobStatus,
} from "@/lib/constants";
import { WEBSITE_URL } from "@/lib/env";
import { omitKey, toDateInput } from "@/lib/format";
import { toSlug } from "@/lib/slug";
import type { ApiResponse, JobDTO } from "@/lib/types";
import { useUnsavedChanges } from "@/lib/use-unsaved-changes";
import { fieldErrors, jobSchema } from "@/lib/validators";

const DEPARTMENTS = ["Operations", "Technical", "Cleaning", "Administration", "Pest Control", "Projects"];

type FormState = {
  title: string;
  slug: string;
  department: string;
  location: JobLocation | "";
  employmentType: EmploymentType | "";
  experienceLevel: ExperienceLevel | "";
  salary: string;
  summary: string;
  description: string;
  responsibilities: ListItem[];
  requirements: ListItem[];
  benefits: ListItem[];
  applicationEmail: string;
  applicationWhatsapp: string;
  applicationInstructions: string;
  deadline: string;
};

type ListKey = "responsibilities" | "requirements" | "benefits";

function toFormState(job?: JobDTO): FormState {
  return {
    title: job?.title ?? "",
    slug: job?.slug ?? "",
    department: job?.department ?? "",
    location: job?.location ?? "",
    employmentType: job?.employmentType ?? "",
    experienceLevel: job?.experienceLevel ?? "",
    salary: job?.salary ?? "",
    summary: job?.summary ?? "",
    description: job?.description ?? "",
    responsibilities: toListItems(job?.responsibilities ?? [""]),
    requirements: toListItems(job?.requirements ?? [""]),
    benefits: toListItems(job?.benefits ?? []),
    applicationEmail: job?.applicationEmail ?? COMPANY_EMAIL,
    applicationWhatsapp: job?.applicationWhatsapp ?? "",
    applicationInstructions: job?.applicationInstructions ?? "",
    deadline: toDateInput(job?.deadline),
  };
}

/** Converts form state to the API payload (list rows become trimmed, non-empty strings). */
function toPayload(form: FormState) {
  const list = (items: ListItem[]) => items.map((item) => item.value.trim()).filter(Boolean);
  return {
    ...form,
    responsibilities: list(form.responsibilities),
    requirements: list(form.requirements),
    benefits: list(form.benefits),
  };
}

export function JobForm({ job }: { job?: JobDTO }) {
  const router = useRouter();
  const toast = useToast();
  const [initial] = useState(() => toFormState(job));
  const [form, setForm] = useState<FormState>(initial);
  const [saved, setSaved] = useState<FormState>(initial);
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "draft");
  const [slugTouched, setSlugTouched] = useState(Boolean(job));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<JobStatus | null>(null);

  const dirty = JSON.stringify(toPayload(form)) !== JSON.stringify(toPayload(saved));
  useUnsavedChanges(dirty && !submitting);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => omitKey(prev, key));
  }

  function onTitleChange(title: string) {
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : title ? toSlug(title) : "" }));
    if (errors.title) setErrors((prev) => omitKey(prev, "title"));
  }

  async function save(nextStatus: JobStatus) {
    const parsed = jobSchema.safeParse({ ...toPayload(form), status: nextStatus });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(nextStatus);
    try {
      const { data } = await apiFetch<ApiResponse<JobDTO>>(job ? `/api/admin/jobs/${job.id}` : "/api/admin/jobs", {
        method: job ? "PATCH" : "POST",
        json: parsed.data,
      });
      const fresh = toFormState(data);
      setForm(fresh);
      setSaved(fresh);
      setStatus(data.status);
      setErrors({});
      const messages: Record<JobStatus, string> = {
        draft: "Job saved as draft.",
        open: status === "open" ? "Job updated." : "Job published. It is now open for applications.",
        closed: "Job saved and closed.",
      };
      toast.success(messages[data.status]);
      if (!job) router.replace(`/dashboard/jobs/${data.id}/edit`);
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        setErrors(Object.fromEntries(Object.entries(error.details).map(([key, messages]) => [key, messages?.[0] ?? ""])));
      }
      if (error instanceof ApiError && error.status === 409) setErrors((prev) => ({ ...prev, slug: error.message }));
      toast.error(error instanceof Error ? error.message : "Could not save the job");
    } finally {
      setSubmitting(null);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save(status);
  }

  const listField = (key: ListKey, label: string, addLabel: string, placeholder: string, hint?: ReactNode) => (
    <Field id={key} label={label} error={errors[key]} hint={hint}>
      <ListInput id={key} items={form[key]} onChange={(items) => set(key, items)} addLabel={addLabel} placeholder={placeholder} />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <Link href="/dashboard/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-4" aria-hidden /> All vacancies
      </Link>
      <PageHeader
        title={job ? "Edit job vacancy" : "New job vacancy"}
        description={dirty ? "You have unsaved changes." : job ? "All changes saved." : "Create a new opening for the careers page."}
        actions={
          <>
            {job && status !== "draft" && (
              <a
                href={`${WEBSITE_URL}/careers/${saved.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                View on site <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
            <Button variant="secondary" onClick={() => save("draft")} loading={submitting === "draft"} disabled={Boolean(submitting)}>
              Save Draft
            </Button>
            {job && (
              <Button variant="dark" onClick={() => save("closed")} loading={submitting === "closed"} disabled={Boolean(submitting)}>
                Close
              </Button>
            )}
            <Button onClick={() => save("open")} loading={submitting === "open"} disabled={Boolean(submitting)}>
              {status === "open" ? "Save (Open)" : "Publish (Open)"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Field id="title" label="Job title" required error={errors.title}>
                <input
                  {...fieldA11y("title", errors.title)}
                  value={form.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  className={`${inputClass} text-base font-semibold`}
                  placeholder="e.g. Facilities Technician (HVAC)"
                />
              </Field>
              <Field id="slug" label="Slug" error={errors.slug} hint={`URL: /careers/${form.slug || "job-slug"}`}>
                <input
                  {...fieldA11y("slug", errors.slug)}
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    set("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className={`${inputClass} font-mono`}
                />
              </Field>
              <Field id="summary" label="Summary" required error={errors.summary} hint={`${form.summary.length}/300 · shown on job cards`}>
                <textarea
                  {...fieldA11y("summary", errors.summary)}
                  rows={2}
                  value={form.summary}
                  onChange={(event) => set("summary", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          <Card title="Description">
            <Field id="description" label="About the role (Markdown)" error={errors.description}>
              <MarkdownEditor
                id="description"
                rows={10}
                value={form.description}
                onChange={(value) => set("description", value)}
                error={errors.description}
              />
            </Field>
          </Card>

          <Card title="Role details">
            <div className="space-y-6">
              {listField("responsibilities", "Responsibilities", "Add responsibility", "e.g. Carry out preventive maintenance on AC units")}
              {listField("requirements", "Requirements", "Add requirement", "e.g. HND in Refrigeration & Air-Conditioning")}
              {listField("benefits", "Benefits (optional)", "Add benefit", "e.g. SSNIT contributions")}
            </div>
          </Card>

          <Card title="How to apply">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="applicationEmail" label="Application email" error={errors.applicationEmail} hint="Defaults to the company email.">
                <input
                  {...fieldA11y("applicationEmail", errors.applicationEmail)}
                  type="email"
                  value={form.applicationEmail}
                  onChange={(event) => set("applicationEmail", event.target.value.trim())}
                  className={inputClass}
                />
              </Field>
              <Field id="applicationWhatsapp" label="Application WhatsApp" error={errors.applicationWhatsapp} hint="Optional, e.g. +233205935800">
                <input
                  {...fieldA11y("applicationWhatsapp", errors.applicationWhatsapp)}
                  type="tel"
                  value={form.applicationWhatsapp}
                  onChange={(event) => set("applicationWhatsapp", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field id="applicationInstructions" label="Application instructions" error={errors.applicationInstructions} className="sm:col-span-2">
                <textarea
                  {...fieldA11y("applicationInstructions", errors.applicationInstructions)}
                  rows={3}
                  value={form.applicationInstructions}
                  onChange={(event) => set("applicationInstructions", event.target.value)}
                  className={inputClass}
                  placeholder="e.g. Send your CV and a short cover letter with the job title in the subject line."
                />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Details">
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Status</span>
                <StatusBadge status={status} />
              </div>
              <Field id="department" label="Department" required error={errors.department}>
                <input
                  {...fieldA11y("department", errors.department)}
                  list="departments"
                  value={form.department}
                  onChange={(event) => set("department", event.target.value)}
                  className={inputClass}
                />
                <datalist id="departments">
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department} />
                  ))}
                </datalist>
              </Field>
              <Field id="location" label="Location" required error={errors.location}>
                <select
                  {...fieldA11y("location", errors.location)}
                  value={form.location}
                  onChange={(event) => set("location", event.target.value as JobLocation)}
                  className={inputClass}
                >
                  <option value="">Select a location</option>
                  {JOB_LOCATIONS.map((location) => (
                    <option key={location}>{location}</option>
                  ))}
                </select>
              </Field>
              <Field id="employmentType" label="Employment type" required error={errors.employmentType}>
                <select
                  {...fieldA11y("employmentType", errors.employmentType)}
                  value={form.employmentType}
                  onChange={(event) => set("employmentType", event.target.value as EmploymentType)}
                  className={inputClass}
                >
                  <option value="">Select a type</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field id="experienceLevel" label="Experience level" error={errors.experienceLevel}>
                <select
                  {...fieldA11y("experienceLevel", errors.experienceLevel)}
                  value={form.experienceLevel}
                  onChange={(event) => set("experienceLevel", event.target.value as ExperienceLevel | "")}
                  className={inputClass}
                >
                  <option value="">Not specified</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              </Field>
              <Field id="salary" label="Salary" error={errors.salary} hint='e.g. "GHS 2,500 – 3,500 / month" or "Negotiable"'>
                <input
                  {...fieldA11y("salary", errors.salary)}
                  value={form.salary}
                  onChange={(event) => set("salary", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field id="deadline" label="Application deadline" error={errors.deadline} hint="Hidden from the careers page after this date.">
                <input
                  {...fieldA11y("deadline", errors.deadline)}
                  type="date"
                  value={form.deadline}
                  onChange={(event) => set("deadline", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
