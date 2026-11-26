import type { Metadata } from "next";
import { PostsTable } from "@/components/posts/PostsTable";

export const metadata: Metadata = { title: "Blog Posts" };

export default function PostsPage() {
  return <PostsTable />;
}
