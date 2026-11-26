import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, notFound, ok } from "@/lib/http";
import { Job } from "@/models/Job";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

/** Returns open or closed jobs (so old links can show "closed"); drafts are never exposed. */
export async function GET(request: Request, { params }: RouteContext<"/api/public/jobs/[slug]">) {
  try {
    const { slug } = await params;
    await connectDB();
    const job = await Job.findOne({ slug, status: { $in: ["open", "closed"] } });
    return withCors(request, job ? ok(job) : notFound("Job"));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
