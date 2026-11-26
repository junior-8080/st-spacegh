import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { JobsBrowser } from "@/components/JobsBrowser";
import { PageHero } from "@/components/PageHero";
import { Container, Gold } from "@/components/ui";
import { getJobs } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the ST-SPACE team. Explore open facilities management, technical, cleaning and pest control vacancies in Accra and Kumasi.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        ribbon="Careers"
        title={
          <>
            Join the <Gold>ST-SPACE</Gold> team
          </>
        }
        description="We're building a team of skilled, dependable people who take pride in looking after the spaces our clients rely on. If that sounds like you, we'd love to hear from you."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Careers" }]}
      />
      <section className="bg-brand-offwhite py-16 sm:py-24">
        <Container>
          <JobsBrowser jobs={jobs} email={site.contact.email} />
        </Container>
      </section>
      <CTASection
        title={
          <>
            Don&apos;t see the right role? <Gold>Send us your CV.</Gold>
          </>
        }
        text={`We keep promising CVs on file for future openings. Email ${site.contact.email} or reach us on WhatsApp.`}
      />
    </>
  );
}
