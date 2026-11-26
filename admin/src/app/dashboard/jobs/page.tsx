import type { Metadata } from "next";
import { JobsTable } from "@/components/jobs/JobsTable";

export const metadata: Metadata = { title: "Job Vacancies" };

export default function JobsPage() {
  return <JobsTable />;
}
