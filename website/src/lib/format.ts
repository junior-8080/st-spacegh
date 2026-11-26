export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(value),
  );
}

/** Estimated reading time at ~200 words per minute. */
export function readingTime(markdown: string): number {
  const words = markdown.replace(/[#>*_`[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** A job is closed if its status says so or its deadline day has passed. */
export function isJobClosed(job: { status: string; deadline: string | null }): boolean {
  if (job.status !== "open") return true;
  if (!job.deadline) return false;
  const now = new Date();
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return new Date(job.deadline).getTime() < startOfToday;
}

/** Converts a phone number such as 0205935800 or +233 20 593 5800 to wa.me format. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
}

/** "GHS 15,000 / month", or "Price on request" when no price is set. */
export function formatPrice(price: number | null | undefined, period = ""): string {
  if (price === null || price === undefined) return "Price on request";
  const amount = `GHS ${new Intl.NumberFormat("en-GH", { maximumFractionDigits: 2 }).format(price)}`;
  return period ? `${amount} ${period.replace(/^per /, "/ ")}` : amount;
}
