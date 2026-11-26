import { updatePost } from "@/lib/content";
import { connectDB } from "@/lib/db";
import { handleError, isValidId, notFound, ok } from "@/lib/http";
import { revalidateWebsite } from "@/lib/revalidate";
import { postUpdateSchema } from "@/lib/validators";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

type Context = RouteContext<"/api/admin/posts/[id]">;

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Post");
    await connectDB();
    const post = await Post.findById(id);
    return post ? ok(post) : notFound("Post");
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Post");
    const input = postUpdateSchema.parse(await request.json());
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return notFound("Post");
    await updatePost(post, input);
    revalidateWebsite("posts");
    return ok(post);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!isValidId(id)) return notFound("Post");
    await connectDB();
    const post = await Post.findByIdAndDelete(id);
    if (!post) return notFound("Post");
    revalidateWebsite("posts");
    return ok({ id });
  } catch (error) {
    return handleError(error);
  }
}
