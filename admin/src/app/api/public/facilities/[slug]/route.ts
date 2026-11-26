import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, notFound, ok } from "@/lib/http";
import { Facility } from "@/models/Facility";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, { params }: RouteContext<"/api/public/facilities/[slug]">) {
  try {
    const { slug } = await params;
    await connectDB();
    const facility = await Facility.findOne({ slug, status: "published" });
    return withCors(request, facility ? ok(facility) : notFound("Facility"));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
