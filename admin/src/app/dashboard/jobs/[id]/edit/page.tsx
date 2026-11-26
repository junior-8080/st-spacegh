import type { Metadata } from "next";
import { EditLoader } from "@/components/EditLoader";

export const metadata: Metadata = { title: "Edit job vacancy" };

export default async function EditJobPage({ params }: PageProps<"/dashboard/jobs/[id]/edit">) {
  const { id } = await params;
  return <EditLoader kind="job" id={id} />;
}
