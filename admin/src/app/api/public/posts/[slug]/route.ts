import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, notFound, ok } from "@/lib/http";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, { params }: RouteContext<"/api/public/posts/[slug]">) {
  try {
    const { slug } = await params;
    await connectDB();
    const post = await Post.findOne({ slug, status: "published" });
    return withCors(request, post ? ok(post) : notFound("Post"));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
