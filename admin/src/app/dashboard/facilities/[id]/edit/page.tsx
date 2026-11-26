import type { Metadata } from "next";
import { EditLoader } from "@/components/EditLoader";

export const metadata: Metadata = { title: "Edit facility" };

export default async function EditFacilityPage({ params }: PageProps<"/dashboard/facilities/[id]/edit">) {
  const { id } = await params;
  return <EditLoader kind="facility" id={id} />;
}
