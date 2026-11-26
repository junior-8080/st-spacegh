import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_PAGE_SIZE, JOB_STATUSES, isOneOf } from "@/lib/constants";
import { createJob, searchFilter } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, ok, paginate } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { jobSchema } from "@/lib/validators";
import { Job } from "@/models/Job";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const { page, limit, skip } = paginate(params, ADMIN_PAGE_SIZE);
    const status = params.get("status");
    const filter = {
      ...searchFilter(params.get("search"), ["title", "department", "summary"]),
      ...(isOneOf(JOB_STATUSES, status) ? { status } : {}),
    };

    const [jobs, total] = await Promise.all([
      Job.find(filter).select("-description").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);
    return NextResponse.json({ data: jobs, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const input = jobSchema.parse(await request.json());
    const job = await createJob(input);
    revalidateWebsite("jobs");
    return ok(job, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
