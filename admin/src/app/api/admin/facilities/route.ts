import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_PAGE_SIZE, FACILITY_STATUSES, isOneOf } from "@/lib/constants";
import { createFacility, searchFilter } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, ok, paginate } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { facilitySchema } from "@/lib/validators";
import { Facility } from "@/models/Facility";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const { page, limit, skip } = paginate(params, ADMIN_PAGE_SIZE);
    const status = params.get("status");
    const filter = {
      ...searchFilter(params.get("search"), ["name", "location", "summary"]),
      ...(isOneOf(FACILITY_STATUSES, status) ? { status } : {}),
    };

    const [facilities, total] = await Promise.all([
      Facility.find(filter).select("-description").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Facility.countDocuments(filter),
    ]);
    return NextResponse.json({ data: facilities, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const input = facilitySchema.parse(await request.json());
    const facility = await createFacility(input);
    revalidateWebsite("facilities");
    return ok(facility, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
