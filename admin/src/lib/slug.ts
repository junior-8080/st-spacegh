import type { Model, Types } from "mongoose";
import slugify from "slugify";

export function toSlug(value: string): string {
  return slugify(value, { lower: true, strict: true, trim: true }).slice(0, 100) || "item";
}

/** Returns `base`, or `base-2`, `base-3`… if the slug is already taken by another document. */
export async function uniqueSlug<T extends { slug: string }>(
  model: Model<T>,
  value: string,
  excludeId?: string | Types.ObjectId,
): Promise<string> {
  const base = toSlug(value);
  let candidate = base;
  for (let n = 2; ; n++) {
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await model.exists(filter);
    if (!exists) return candidate;
    candidate = `${base}-${n}`;
  }
}
