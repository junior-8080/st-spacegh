import type { Metadata } from "next";
import { JobForm } from "@/components/jobs/JobForm";

export const metadata: Metadata = { title: "New job vacancy" };

export default function NewJobPage() {
  return <JobForm />;
}
