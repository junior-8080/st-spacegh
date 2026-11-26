export function formatDate(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

/** "2025-01-31T00:00:00.000Z" → "2025-01-31" for <input type="date">. */
export function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

/** Converts a Ghanaian phone number such as 0244 370 672 to wa.me format (233244370672). */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return digits;
}

export function isPast(value: string | null | undefined): boolean {
  if (!value) return false;
  const today = new Date();
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return new Date(value).getTime() < startOfToday;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Returns a copy of `record` without `key`. */
export function omitKey<T extends Record<string, unknown>>(record: T, key: string): T {
  const copy = { ...record };
  delete copy[key];
  return copy;
}

/** "GHS 5,000 / month", or "Price on request" when no price is set. */
export function formatPrice(price: number | null | undefined, period = ""): string {
  if (price === null || price === undefined) return "Price on request";
  const amount = `GHS ${new Intl.NumberFormat("en-GH", { maximumFractionDigits: 2 }).format(price)}`;
  return period ? `${amount} ${period.replace(/^per /, "/ ")}` : amount;
}
