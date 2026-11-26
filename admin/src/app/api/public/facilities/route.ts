import type { NextRequest } from "next/server";
import { FACILITY_TYPES, isOneOf } from "@/lib/constants";
import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/http";
import { Facility } from "@/models/Facility";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

/** Published facilities, featured first. Optional `?type=` and `?featured=true` filters. */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const type = params.get("type");
    const facilities = await Facility.find({
      status: "published" as const,
      ...(isOneOf(FACILITY_TYPES, type) ? { type } : {}),
      ...(params.get("featured") === "true" ? { featured: true } : {}),
    })
      .select("-description -status")
      .sort({ featured: -1, publishedAt: -1 });
    return withCors(request, ok(facilities));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
