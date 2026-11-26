import { type NextRequest } from "next/server";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/http";
import { deleteImages, r2KeyFromUrl, uploadImage } from "@/lib/r2";
import { detectImageType } from "@/lib/uploads";
import { Facility } from "@/models/Facility";

export const runtime = "nodejs";

/** Uploads one image (multipart field "file") to Cloudflare R2 and returns its public URL. */
export async function POST(request: Request) {
  try {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) return fail('Send the image as multipart form data in a "file" field', 400);
    if (file.size === 0) return fail("The file is empty", 400);
    if (file.size > MAX_UPLOAD_BYTES) return fail(`Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller`, 413);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const contentType = detectImageType(bytes);
    if (!contentType) return fail("Only JPEG, PNG, WebP or AVIF images are allowed", 415);

    const url = await uploadImage(bytes, contentType);
    return ok({ url }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/admin/uploads?url=… removes an image from R2 that no saved facility uses
 * (e.g. an image removed in the form before it was saved).
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url") ?? "";
    if (!r2KeyFromUrl(url)) return fail("Not an image in this site's storage", 400);
    await connectDB();
    if (await Facility.exists({ images: url })) return ok({ url, kept: true });
    await deleteImages([url]);
    return ok({ url });
  } catch (error) {
    return handleError(error);
  }
}
