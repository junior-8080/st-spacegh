"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "@/components/editor/ImageUploader";
import { ListInput, toListItems, type ListItem } from "@/components/editor/ListInput";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Button } from "@/components/ui/Button";
import { Card, Field, PageHeader, fieldA11y, inputClass } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { ApiError, apiFetch } from "@/lib/api-client";
import {
  FACILITY_TYPES,
  MAX_FACILITY_IMAGES,
  PRICE_PERIODS,
  type FacilityStatus,
  type FacilityType,
  type PricePeriod,
} from "@/lib/constants";
import { WEBSITE_URL } from "@/lib/env";
import { formatPrice, omitKey } from "@/lib/format";
import { toSlug } from "@/lib/slug";
import type { ApiResponse, FacilityDTO } from "@/lib/types";
import { useUnsavedChanges } from "@/lib/use-unsaved-changes";
import { facilitySchema, fieldErrors } from "@/lib/validators";

type FormState = {
  name: string;
  slug: string;
  type: FacilityType | "";
  location: string;
  summary: string;
  description: string;
  features: ListItem[];
  images: string[];
  price: string;
  pricePeriod: PricePeriod;
  featured: boolean;
};

function toFormState(facility?: FacilityDTO): FormState {
  return {
    name: facility?.name ?? "",
    slug: facility?.slug ?? "",
    type: facility?.type ?? "",
    location: facility?.location ?? "",
    summary: facility?.summary ?? "",
    description: facility?.description ?? "",
    features: toListItems(facility?.features ?? []),
    images: facility?.images ?? [],
    price: facility?.price === null || facility?.price === undefined ? "" : String(facility.price),
    pricePeriod: facility?.pricePeriod ?? "",
    featured: facility?.featured ?? false,
  };
}

/** "5,000" → 5000; "" → null; anything else → NaN (rejected by validation). */
function parsePrice(value: string): number | null {
  const cleaned = value.replace(/[,\s]/g, "").replace(/^GHS/i, "");
  return cleaned ? Number(cleaned) : null;
}

function toPayload(form: FormState) {
  return {
    ...form,
    features: form.features.map((item) => item.value.trim()).filter(Boolean),
    price: parsePrice(form.price),
  };
}

export function FacilityForm({ facility }: { facility?: FacilityDTO }) {
  const router = useRouter();
  const toast = useToast();
  const [initial] = useState(() => toFormState(facility));
  const [form, setForm] = useState<FormState>(initial);
  const [saved, setSaved] = useState<FormState>(initial);
  const [status, setStatus] = useState<FacilityStatus>(facility?.status ?? "draft");
  const [slugTouched, setSlugTouched] = useState(Boolean(facility));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<FacilityStatus | null>(null);

  const dirty = JSON.stringify(toPayload(form)) !== JSON.stringify(toPayload(saved));
  useUnsavedChanges(dirty && !submitting);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => omitKey(prev, key));
  }

  function onNameChange(name: string) {
    setForm((prev) => ({ ...prev, name, slug: slugTouched ? prev.slug : name ? toSlug(name) : "" }));
    if (errors.name) setErrors((prev) => omitKey(prev, "name"));
  }

  async function save(nextStatus: FacilityStatus) {
    const parsed = facilitySchema.safeParse({ ...toPayload(form), status: nextStatus });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(nextStatus);
    try {
      const { data } = await apiFetch<ApiResponse<FacilityDTO>>(
        facility ? `/api/admin/facilities/${facility.id}` : "/api/admin/facilities",
        { method: facility ? "PATCH" : "POST", json: parsed.data },
      );
      const fresh = toFormState(data);
      setForm(fresh);
      setSaved(fresh);
      setStatus(data.status);
      setErrors({});
      const verb = data.status === "published" ? (status === "published" ? "updated" : "published") : "saved as draft";
      toast.success(`Facility ${verb}.`);
      if (!facility) router.replace(`/dashboard/facilities/${data.id}/edit`);
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        setErrors(Object.fromEntries(Object.entries(error.details).map(([key, messages]) => [key, messages?.[0] ?? ""])));
      }
      if (error instanceof ApiError && error.status === 409) setErrors((prev) => ({ ...prev, slug: error.message }));
      toast.error(error instanceof Error ? error.message : "Could not save the facility");
    } finally {
      setSubmitting(null);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save(status);
  }

  const pricePreview = Number.isNaN(parsePrice(form.price)) ? "Invalid amount" : formatPrice(parsePrice(form.price), form.pricePeriod);

  return (
    <form onSubmit={onSubmit} noValidate>
      <Link href="/dashboard/facilities" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-4" aria-hidden /> All facilities
      </Link>
      <PageHeader
        title={facility ? "Edit facility" : "New facility"}
        description={dirty ? "You have unsaved changes." : facility ? "All changes saved." : "Add a facility to show on the website."}
        actions={
          <>
            {facility && status === "published" && (
              <a
                href={`${WEBSITE_URL}/facilities/${saved.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                View on site <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
            <Button variant="secondary" onClick={() => save("draft")} loading={submitting === "draft"} disabled={Boolean(submitting)}>
              {status === "published" ? "Unpublish" : "Save Draft"}
            </Button>
            <Button onClick={() => save("published")} loading={submitting === "published"} disabled={Boolean(submitting)}>
              {status === "published" ? "Save changes" : "Publish"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Field id="name" label="Facility name" required error={errors.name}>
                <input
                  {...fieldA11y("name", errors.name)}
                  value={form.name}
                  onChange={(event) => onNameChange(event.target.value)}
                  className={`${inputClass} text-base font-semibold`}
                  placeholder="e.g. Ridge Corporate Tower"
                />
              </Field>
              <Field id="slug" label="Slug" error={errors.slug} hint={`URL: /facilities/${form.slug || "facility-slug"}`}>
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
              <Field id="summary" label="Summary" error={errors.summary} hint={`${form.summary.length}/300 · shown on facility cards`}>
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

          <Card title="Images">
            <Field id="images" label="Facility photos" error={errors.images} hint="The first image is the cover. Use ★ to set a different cover.">
              <ImageUploader
                id="images"
                images={form.images}
                onChange={(update) => {
                  setForm((prev) => ({ ...prev, images: update(prev.images) }));
                  if (errors.images) setErrors((prev) => omitKey(prev, "images"));
                }}
                max={MAX_FACILITY_IMAGES}
                persisted={saved.images}
                error={errors.images}
              />
            </Field>
          </Card>

          <Card title="Description">
            <Field id="description" label="About this facility (Markdown)" error={errors.description}>
              <MarkdownEditor
                id="description"
                rows={10}
                value={form.description}
                onChange={(value) => set("description", value)}
                error={errors.description}
              />
            </Field>
          </Card>

          <Card title="Features & amenities">
            <Field id="features" label="Features" error={errors.features} hint="e.g. 24/7 security, Backup generator, Ample parking">
              <ListInput
                id="features"
                items={form.features}
                onChange={(items) => set("features", items)}
                addLabel="Add feature"
                placeholder="e.g. Backup generator"
              />
            </Field>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Details">
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Status</span>
                <StatusBadge status={status} />
              </div>
              <Field id="type" label="Facility type" required error={errors.type}>
                <select
                  {...fieldA11y("type", errors.type)}
                  value={form.type}
                  onChange={(event) => set("type", event.target.value as FacilityType)}
                  className={inputClass}
                >
                  <option value="">Select a type</option>
                  {FACILITY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field id="location" label="Location" required error={errors.location}>
                <input
                  {...fieldA11y("location", errors.location)}
                  value={form.location}
                  onChange={(event) => set("location", event.target.value)}
                  className={inputClass}
                  placeholder="e.g. Airport City, Accra"
                />
              </Field>
              <label className="flex items-start gap-3 rounded-md border border-neutral-200 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => set("featured", event.target.checked)}
                  className="mt-0.5 size-4 accent-brand-gold"
                />
                <span>
                  <span className="block font-medium text-neutral-900">Featured</span>
                  <span className="text-neutral-500">Shown first, including on the home page.</span>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Price">
            <div className="space-y-5">
              <Field id="price" label="Amount (GHS)" error={errors.price} hint="Leave empty to show “Price on request”.">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">GHS</span>
                  <input
                    {...fieldA11y("price", errors.price)}
                    inputMode="decimal"
                    value={form.price}
                    onChange={(event) => set("price", event.target.value)}
                    className={`${inputClass} pl-12`}
                    placeholder="e.g. 15,000"
                  />
                </div>
              </Field>
              <Field id="pricePeriod" label="Billing period" error={errors.pricePeriod}>
                <select
                  {...fieldA11y("pricePeriod", errors.pricePeriod)}
                  value={form.pricePeriod}
                  onChange={(event) => set("pricePeriod", event.target.value as PricePeriod)}
                  className={inputClass}
                >
                  {PRICE_PERIODS.map((period) => (
                    <option key={period} value={period}>
                      {period || "No period"}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm">
                <span className="text-neutral-500">Shown as: </span>
                <span className="font-semibold text-neutral-900">{pricePreview}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
