import type { Metadata } from "next";
import { FacilitiesTable } from "@/components/facilities/FacilitiesTable";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
  return <FacilitiesTable />;
}
