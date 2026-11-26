import { updateJob } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, isValidId, notFound, ok } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { jobUpdateSchema } from "@/lib/validators";
import { Job } from "@/models/Job";

export const runtime = "nodejs";

type Context = RouteContext<"/api/admin/jobs/[id]">;

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Job");
    await connectDB();
    const job = await Job.findById(id);
    return job ? ok(job) : notFound("Job");
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Job");
    const input = jobUpdateSchema.parse(await request.json());
    await connectDB();
    const job = await Job.findById(id);
    if (!job) return notFound("Job");
    await updateJob(job, input);
    revalidateWebsite("jobs");
    return ok(job);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Job");
    await connectDB();
    const job = await Job.findByIdAndDelete(id);
    if (!job) return notFound("Job");
    revalidateWebsite("jobs");
    return ok({ id });
  } catch (error) {
    return handleError(error);
  }
}
