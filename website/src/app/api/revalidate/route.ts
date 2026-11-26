import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const TAGS = ["posts", "jobs", "facilities"] as const;

/** Called by the admin API after content changes so the website updates immediately. */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tag?: string } | null;
  const tag = TAGS.find((t) => t === body?.tag);
  if (!tag) {
    return NextResponse.json({ error: `tag must be one of: ${TAGS.join(", ")}` }, { status: 400 });
  }

  // expire: 0 → the next request fetches fresh data instead of serving stale content.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ data: { revalidated: tag } });
}
