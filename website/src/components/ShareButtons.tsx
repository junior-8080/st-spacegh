"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { LinkedInIcon, WhatsAppIcon, XIcon } from "@/components/BrandIcons";

const buttonClass =
  "flex size-10 items-center justify-center rounded-full border border-neutral-300 text-brand-black transition hover:border-brand-black hover:bg-brand-black hover:text-brand-gold";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-heading text-xs font-bold uppercase tracking-wider text-neutral-500">Share</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={buttonClass}
      >
        <WhatsAppIcon className="size-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClass}
      >
        <LinkedInIcon className="size-4" />
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={buttonClass}
      >
        <XIcon className="size-3.5" />
      </a>
      <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} className={buttonClass}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
