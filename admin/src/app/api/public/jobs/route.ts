import type { NextRequest } from "next/server";
import { EMPLOYMENT_TYPES, JOB_LOCATIONS, isOneOf } from "@/lib/constants";
import { startOfToday } from "@/lib/content";
import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/http";
import { Job } from "@/models/Job";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const location = params.get("location");
    const type = params.get("type");
    const jobs = await Job.find({
      status: "open",
      $or: [{ deadline: null }, { deadline: { $gte: startOfToday() } }],
      ...(isOneOf(JOB_LOCATIONS, location) ? { location } : {}),
      ...(isOneOf(EMPLOYMENT_TYPES, type) ? { employmentType: type } : {}),
    })
      .select("-description -responsibilities -requirements -benefits -applicationInstructions")
      .sort({ publishedAt: -1 });
    return withCors(request, ok(jobs));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
