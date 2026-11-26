import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_PAGE_SIZE, POST_STATUSES, isOneOf } from "@/lib/constants";
import { createPost, searchFilter } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, ok, paginate } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { postSchema } from "@/lib/validators";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const params = request.nextUrl.searchParams;
    const { page, limit, skip } = paginate(params, ADMIN_PAGE_SIZE);
    const status = params.get("status");
    const filter = {
      ...searchFilter(params.get("search"), ["title", "excerpt", "tags"]),
      ...(isOneOf(POST_STATUSES, status) ? { status } : {}),
    };

    const [posts, total] = await Promise.all([
      Post.find(filter).select("-content").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filter),
    ]);
    return NextResponse.json({ data: posts, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const input = postSchema.parse(await request.json());
    const post = await createPost(input);
    revalidateWebsite("posts");
    return ok(post, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
