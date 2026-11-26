"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api-client";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { cn } from "@/lib/format";
import type { ApiResponse } from "@/lib/types";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type ImageUploaderProps = {
  id: string;
  images: string[];
  /** Receives an updater so concurrent uploads never overwrite each other. */
  onChange: (update: (images: string[]) => string[]) => void;
  max: number;
  /** Images already saved on the record; these are only deleted when the record is saved. */
  persisted: string[];
  error?: string;
};

/** Multi-image uploader with drag & drop, reordering and "set as cover" (the first image is the cover). */
export function ImageUploader({ id, images, onChange, max, persisted, error }: ImageUploaderProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const room = max - images.length;
    if (room <= 0) {
      toast.error(`You can add up to ${max} images.`);
      return;
    }
    if (files.length > room) toast.error(`Only the first ${room} image(s) were added (maximum ${max}).`);

    const valid = files.slice(0, room).filter((file) => {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(`${file.name}: only JPEG, PNG, WebP or AVIF images are allowed.`);
        return false;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error(`${file.name} is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
        return false;
      }
      return true;
    });

    setUploading((n) => n + valid.length);
    await Promise.all(
      valid.map(async (file) => {
        const body = new FormData();
        body.append("file", file);
        try {
          const { data } = await apiFetch<ApiResponse<{ url: string }>>("/api/admin/uploads", { method: "POST", body });
          onChange((prev) => (prev.length < max ? [...prev, data.url] : prev));
        } catch (err) {
          toast.error(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  }

  function remove(image: string) {
    onChange((prev) => prev.filter((item) => item !== image));
    // Not saved on the record yet: delete it now so it doesn't linger in the database.
    if (!persisted.includes(image)) {
      apiFetch(`/api/admin/uploads?url=${encodeURIComponent(image)}`, { method: "DELETE" }).catch(() => undefined);
    }
  }

  function move(index: number, direction: -1 | 1) {
    onChange((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function makeCover(index: number) {
    onChange((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) uploadFiles(event.dataTransfer.files);
  }

  const full = images.length >= max;

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <Image src={image} alt={`Facility image ${index + 1}`} fill unoptimized sizes="240px" className="object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-brand-black px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-brand-gold">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                <div className="flex gap-1">
                  <IconButton label="Move left" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowLeft className="size-3.5" />
                  </IconButton>
                  <IconButton label="Move right" disabled={index === images.length - 1} onClick={() => move(index, 1)}>
                    <ArrowRight className="size-3.5" />
                  </IconButton>
                  {index > 0 && (
                    <IconButton label="Set as cover image" onClick={() => makeCover(index)}>
                      <Star className="size-3.5" />
                    </IconButton>
                  )}
                </div>
                <IconButton label="Remove image" danger onClick={() => remove(image)}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition",
            dragging ? "border-brand-gold bg-amber-50" : error ? "border-red-400" : "border-neutral-300 bg-neutral-50",
          )}
        >
          {uploading > 0 ? (
            <Loader2 className="size-7 animate-spin text-brand-gold-ink" aria-hidden />
          ) : (
            <ImagePlus className="size-7 text-neutral-400" aria-hidden />
          )}
          <p className="mt-2 text-sm text-neutral-600">
            {uploading > 0 ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…` : "Drag images here, or"}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Choose images
          </button>
          <p className="mt-2 text-xs text-neutral-500">
            JPEG, PNG, WebP or AVIF · up to {MAX_UPLOAD_BYTES / 1024 / 1024} MB each · {images.length}/{max} used
          </p>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPTED.join(",")}
            multiple
            className="sr-only"
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => {
              if (event.target.files?.length) uploadFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded bg-white/90 p-1.5 text-neutral-800 transition disabled:opacity-30",
        danger ? "hover:bg-red-600 hover:text-white" : "hover:bg-brand-gold",
      )}
    >
      {children}
    </button>
  );
}
