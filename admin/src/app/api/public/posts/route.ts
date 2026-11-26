import { NextResponse, type NextRequest } from "next/server";
import { POST_CATEGORIES, isOneOf } from "@/lib/constants";
import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, paginate } from "@/lib/http";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const { page, limit, skip } = paginate(params, 9);
    const category = params.get("category");
    const filter = {
      status: "published" as const,
      ...(isOneOf(POST_CATEGORIES, category) ? { category } : {}),
    };

    const [posts, total] = await Promise.all([
      Post.find(filter).select("-content -status").sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filter),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return withCors(request, NextResponse.json({ data: posts, total, page, totalPages }));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
