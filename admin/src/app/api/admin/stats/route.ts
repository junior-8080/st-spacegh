import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/http";
import { Facility } from "@/models/Facility";
import { Job } from "@/models/Job";
import { Message } from "@/models/Message";
import { Post } from "@/models/Post";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const [publishedPosts, draftPosts, openJobs, closedJobs, unreadMessages, publishedFacilities] = await Promise.all([
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Job.countDocuments({ status: "open" }),
      Job.countDocuments({ status: "closed" }),
      Message.countDocuments({ read: false }),
      Facility.countDocuments({ status: "published" }),
    ]);
    return ok({ publishedPosts, draftPosts, openJobs, closedJobs, unreadMessages, publishedFacilities });
  } catch (error) {
    return handleError(error);
  }
}
