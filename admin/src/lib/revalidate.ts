import { after } from "next/server";

/**
 * Fire-and-forget: asks the website to refresh cached content for a tag.
 * Failures are ignored, the website's 60-second revalidation covers them.
 */
export function revalidateWebsite(tag: "posts" | "jobs" | "facilities"): void {
  const url = process.env.WEBSITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  after(async () => {
    try {
      await fetch(`${url.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
        body: JSON.stringify({ tag }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // Ignored on purpose: time-based revalidation is the fallback.
    }
  });
}
