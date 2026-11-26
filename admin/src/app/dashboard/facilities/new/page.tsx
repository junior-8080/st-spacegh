import type { Metadata } from "next";
import { FacilityForm } from "@/components/facilities/FacilityForm";

export const metadata: Metadata = { title: "New facility" };

export default function NewFacilityPage() {
  return <FacilityForm />;
}
