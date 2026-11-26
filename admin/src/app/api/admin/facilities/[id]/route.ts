import { updateFacility } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, isValidId, notFound, ok } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { deleteImages } from "@/lib/r2";
import { facilityUpdateSchema } from "@/lib/validators";
import { Facility } from "@/models/Facility";

export const runtime = "nodejs";

type Context = RouteContext<"/api/admin/facilities/[id]">;

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Facility");
    await connectDB();
    const facility = await Facility.findById(id);
    return facility ? ok(facility) : notFound("Facility");
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Facility");
    const input = facilityUpdateSchema.parse(await request.json());
    await connectDB();
    const facility = await Facility.findById(id);
    if (!facility) return notFound("Facility");
    await updateFacility(facility, input);
    revalidateWebsite("facilities");
    return ok(facility);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Facility");
    await connectDB();
    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) return notFound("Facility");
    await deleteImages(facility.images).catch((error) => console.error("R2 delete failed", error));
    revalidateWebsite("facilities");
    return ok({ id });
  } catch (error) {
    return handleError(error);
  }
}
