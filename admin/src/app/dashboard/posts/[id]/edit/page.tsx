import type { Metadata } from "next";
import { EditLoader } from "@/components/EditLoader";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/dashboard/posts/[id]/edit">) {
  const { id } = await params;
  return <EditLoader kind="post" id={id} />;
}
