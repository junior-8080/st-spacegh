"use client";

import { ArrowLeft, ChevronDown, ExternalLink, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { TagInput } from "@/components/editor/TagInput";
import { Button } from "@/components/ui/Button";
import { Card, Field, PageHeader, fieldA11y, inputClass } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { ApiError, apiFetch } from "@/lib/api-client";
import { DEFAULT_AUTHOR, POST_CATEGORIES, type PostCategory, type PostStatus } from "@/lib/constants";
import { WEBSITE_URL } from "@/lib/env";
import { omitKey } from "@/lib/format";
import { toSlug } from "@/lib/slug";
import type { ApiResponse, PostDTO } from "@/lib/types";
import { useUnsavedChanges } from "@/lib/use-unsaved-changes";
import { fieldErrors, postSchema } from "@/lib/validators";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: PostCategory | "";
  tags: string[];
  author: string;
  seoTitle: string;
  seoDescription: string;
};

function toFormState(post?: PostDTO): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    category: post?.category ?? "",
    tags: post?.tags ?? [],
    author: post?.author ?? DEFAULT_AUTHOR,
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  };
}

function isHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function PostForm({ post }: { post?: PostDTO }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(() => toFormState(post));
  const [saved, setSaved] = useState<FormState>(() => toFormState(post));
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [seoOpen, setSeoOpen] = useState(Boolean(post?.seoTitle || post?.seoDescription));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<PostStatus | null>(null);
  const [brokenImage, setBrokenImage] = useState<string | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedChanges(dirty && !submitting);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => omitKey(prev, key));
  }

  function onTitleChange(title: string) {
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : title ? toSlug(title) : "" }));
    if (errors.title) setErrors((prev) => omitKey(prev, "title"));
  }

  async function save(nextStatus: PostStatus) {
    const parsed = postSchema.safeParse({ ...form, status: nextStatus });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(nextStatus);
    try {
      const { data } = await apiFetch<ApiResponse<PostDTO>>(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
        method: post ? "PATCH" : "POST",
        json: parsed.data,
      });
      const fresh = toFormState(data);
      setForm(fresh);
      setSaved(fresh);
      setStatus(data.status);
      setErrors({});
      const verb = data.status === "published" ? (status === "published" ? "updated" : "published") : "saved as draft";
      toast.success(`Post ${verb}.`);
      if (!post) router.replace(`/dashboard/posts/${data.id}/edit`);
    } catch (error) {
      if (error instanceof ApiError && error.details) {
        setErrors(Object.fromEntries(Object.entries(error.details).map(([key, messages]) => [key, messages?.[0] ?? ""])));
      }
      if (error instanceof ApiError && error.status === 409) setErrors((prev) => ({ ...prev, slug: error.message }));
      toast.error(error instanceof Error ? error.message : "Could not save the post");
    } finally {
      setSubmitting(null);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save(status);
  }

  const showPreview = isHttpUrl(form.coverImage);

  return (
    <form onSubmit={onSubmit} noValidate>
      <Link href="/dashboard/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-4" aria-hidden /> All posts
      </Link>
      <PageHeader
        title={post ? "Edit post" : "New post"}
        description={dirty ? "You have unsaved changes." : post ? "All changes saved." : "Draft a new article for the blog."}
        actions={
          <>
            {post && status === "published" && (
              <a
                href={`${WEBSITE_URL}/blog/${saved.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                View on site <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
            {status === "published" ? (
              <>
                <Button variant="secondary" onClick={() => save("draft")} loading={submitting === "draft"} disabled={Boolean(submitting)}>
                  Unpublish
                </Button>
                <Button onClick={() => save("published")} loading={submitting === "published"} disabled={Boolean(submitting)}>
                  Save changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => save("draft")} loading={submitting === "draft"} disabled={Boolean(submitting)}>
                  Save Draft
                </Button>
                <Button onClick={() => save("published")} loading={submitting === "published"} disabled={Boolean(submitting)}>
                  Publish
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Field id="title" label="Title" required error={errors.title}>
                <input
                  {...fieldA11y("title", errors.title)}
                  value={form.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  className={`${inputClass} text-base font-semibold`}
                  placeholder="e.g. 5 Signs Your Office Air Conditioning Needs Servicing"
                />
              </Field>
              <Field
                id="slug"
                label="Slug"
                error={errors.slug}
                hint={
                  <>
                    URL: /blog/{form.slug || "your-post-slug"}
                    {!slugTouched && " · generated from the title"}
                  </>
                }
              >
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
              <Field
                id="excerpt"
                label="Excerpt"
                error={errors.excerpt}
                hint={<span className={form.excerpt.length > 300 ? "text-red-600" : ""}>{form.excerpt.length}/300 characters</span>}
              >
                <textarea
                  {...fieldA11y("excerpt", errors.excerpt)}
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) => set("excerpt", event.target.value)}
                  className={inputClass}
                  placeholder="A short summary shown on the blog list and in search results."
                />
              </Field>
            </div>
          </Card>

          <Card title="Content">
            <Field id="content" label="Article body (Markdown)" required error={errors.content}>
              <MarkdownEditor
                id="content"
                value={form.content}
                onChange={(value) => set("content", value)}
                error={errors.content}
                placeholder="Write your article here. Use the toolbar for headings, lists and links."
              />
            </Field>
          </Card>

          <Card>
            <button
              type="button"
              onClick={() => setSeoOpen((open) => !open)}
              aria-expanded={seoOpen}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-500">SEO</span>
              <ChevronDown className={`size-5 text-neutral-500 transition ${seoOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {seoOpen && (
              <div className="mt-5 space-y-5">
                <Field id="seoTitle" label="SEO title" error={errors.seoTitle} hint={`${form.seoTitle.length}/70 · defaults to the post title`}>
                  <input
                    {...fieldA11y("seoTitle", errors.seoTitle)}
                    value={form.seoTitle}
                    onChange={(event) => set("seoTitle", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field
                  id="seoDescription"
                  label="SEO description"
                  error={errors.seoDescription}
                  hint={`${form.seoDescription.length}/160 · defaults to the excerpt`}
                >
                  <textarea
                    {...fieldA11y("seoDescription", errors.seoDescription)}
                    rows={2}
                    value={form.seoDescription}
                    onChange={(event) => set("seoDescription", event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Status</span>
                <StatusBadge status={status} />
              </div>
              <Field id="category" label="Category" required error={errors.category}>
                <select
                  {...fieldA11y("category", errors.category)}
                  value={form.category}
                  onChange={(event) => set("category", event.target.value as PostCategory)}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  {POST_CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field id="tags" label="Tags" error={errors.tags} hint="Press Enter or comma to add a tag.">
                <TagInput id="tags" value={form.tags} onChange={(tags) => set("tags", tags)} />
              </Field>
              <Field id="author" label="Author" error={errors.author}>
                <input
                  {...fieldA11y("author", errors.author)}
                  value={form.author}
                  onChange={(event) => set("author", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          <Card title="Cover image">
            <Field id="coverImage" label="Image URL" error={errors.coverImage} hint="Paste a link to a hosted image (https://…).">
              <input
                {...fieldA11y("coverImage", errors.coverImage)}
                type="url"
                value={form.coverImage}
                onChange={(event) => set("coverImage", event.target.value.trim())}
                className={inputClass}
                placeholder="https://"
              />
            </Field>
            <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              {showPreview && brokenImage !== form.coverImage ? (
                <Image
                  src={form.coverImage}
                  alt="Cover image preview"
                  fill
                  unoptimized
                  sizes="320px"
                  className="object-cover"
                  onError={() => setBrokenImage(form.coverImage)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-neutral-400">
                  <ImageOff className="size-6" aria-hidden />
                  {showPreview ? "Image could not be loaded" : "No cover image"}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
