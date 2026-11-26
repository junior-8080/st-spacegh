import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Briefcase,
  Building,
  CalendarClock,
  Check,
  Gauge,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { Container, buttonClass } from "@/components/ui";
import { getJob } from "@/lib/api";
import { cn, formatDate, isJobClosed, toWhatsAppNumber } from "@/lib/format";
import { site, siteUrl } from "@/lib/site";
import type { EmploymentType, Job } from "@/types";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const job = await getJob((await params).slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} – ${job.location}`,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: { title: `${job.title} | Careers at ST-SPACE`, description: job.summary, type: "website" },
    robots: isJobClosed(job) ? { index: false } : undefined,
  };
}

const schemaEmploymentType: Record<EmploymentType, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
  Temporary: "TEMPORARY",
};

function jobPostingSchema(job: Job) {
  const cities = job.location === "Accra & Kumasi" ? ["Accra", "Kumasi"] : [job.location];
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.summary, job.description, ...job.responsibilities, ...job.requirements].filter(Boolean).join("\n"),
    datePosted: job.publishedAt,
    ...(job.deadline && { validThrough: job.deadline }),
    employmentType: schemaEmploymentType[job.employmentType],
    hiringOrganization: { "@type": "Organization", name: site.fullName, sameAs: siteUrl, logo: `${siteUrl}/images/logo-mark.svg` },
    ...(job.location === "Remote"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Ghana" } }
      : {
          jobLocation: cities.map((city) => ({
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "GH" },
          })),
        }),
    url: `${siteUrl}/careers/${job.slug}`,
  };
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="font-heading text-xl font-extrabold uppercase text-brand-black">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-neutral-700">
            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-gradient">
              <Check className="size-3 text-brand-black" strokeWidth={3} aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const job = await getJob((await params).slug);
  if (!job) notFound();

  const closed = isJobClosed(job);
  const email = job.applicationEmail || site.contact.email;
  const whatsapp = toWhatsAppNumber(job.applicationWhatsapp || site.contact.whatsapp);
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hello ST-SPACE, I would like to apply for the ${job.title} position (${job.location}).`,
  )}`;

  const chips: Array<{ icon: LucideIcon; label: string; value: string }> = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Type", value: job.employmentType },
    { icon: Building, label: "Department", value: job.department },
    ...(job.experienceLevel ? [{ icon: Gauge, label: "Level", value: job.experienceLevel }] : []),
    ...(job.salary ? [{ icon: Banknote, label: "Salary", value: job.salary }] : []),
    ...(job.deadline ? [{ icon: CalendarClock, label: "Deadline", value: formatDate(job.deadline) }] : []),
  ];

  return (
    <>
      <PageHero
        ribbon={job.department}
        title={job.title}
        description={job.summary}
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/careers", label: "Careers" }, { label: job.title }]}
      >
        <ul className="mt-8 flex flex-wrap gap-3">
          {chips.map((chip) => (
            <li
              key={chip.label}
              className="inline-flex items-center gap-2 border border-brand-graphite bg-brand-charcoal px-3.5 py-2 text-sm text-white"
            >
              <chip.icon className="size-4 text-brand-gold" aria-hidden />
              <span className="sr-only">{chip.label}:</span>
              {chip.value}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          {closed && (
            <div role="status" className="mb-12 flex items-start gap-4 border-l-4 border-brand-gold bg-brand-black p-5 text-white sm:items-center">
              <AlertTriangle className="size-6 shrink-0 text-brand-gold" aria-hidden />
              <div>
                <p className="font-heading font-extrabold uppercase tracking-wide">This position is closed</p>
                <p className="text-sm text-brand-gray">
                  We are no longer accepting applications for this role.{" "}
                  <Link href="/careers" className="font-semibold text-brand-gold underline underline-offset-4">
                    See current openings
                  </Link>
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-14 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7">
              {job.description && (
                <section>
                  <h2 className="font-heading text-xl font-extrabold uppercase text-brand-black">About the role</h2>
                  <Prose content={job.description} className="mt-4 prose-base sm:prose-lg" />
                </section>
              )}
              <ListSection title="Responsibilities" items={job.responsibilities} />
              <ListSection title="Requirements" items={job.requirements} />
              <ListSection title="Benefits" items={job.benefits} />
              <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-gold-ink">
                <ArrowLeft className="size-4" aria-hidden /> Back to all positions
              </Link>
            </div>

            <aside className="lg:col-span-5">
              <div className="clip-angle relative bg-brand-black p-8 sm:p-10 lg:sticky lg:top-28">
                <div aria-hidden className="bg-gold-lines absolute inset-0" />
                <div className="relative">
                  <h2 className="font-heading text-xl font-extrabold uppercase text-white">
                    How to <span className="text-gold-gradient">apply</span>
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-brand-gray">
                    {job.applicationInstructions ||
                      "Send your CV and a short cover letter by email with the job title in the subject line, or reach us on WhatsApp."}
                  </p>
                  {job.deadline && !closed && (
                    <p className="mt-4 text-sm font-semibold text-white">Apply by {formatDate(job.deadline)}.</p>
                  )}
                  <div className="mt-8 flex flex-col gap-3">
                    {closed ? (
                      <>
                        <span aria-disabled="true" className={cn(buttonClass("gold", "lg"), "pointer-events-none opacity-40")}>
                          <Mail className="size-4" aria-hidden /> Apply via Email
                        </span>
                        <span aria-disabled="true" className={cn(buttonClass("outline", "lg"), "pointer-events-none opacity-40")}>
                          <WhatsAppIcon className="size-4" /> Apply via WhatsApp
                        </span>
                      </>
                    ) : (
                      <>
                        <a href={mailto} className={buttonClass("gold", "lg")}>
                          <Mail className="size-4" aria-hidden /> Apply via Email
                        </a>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
                          <WhatsAppIcon className="size-4" /> Apply via WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                  <p className="mt-6 break-all text-xs text-brand-gray">Email: {email}</p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <JsonLd data={jobPostingSchema(job)} />
    </>
  );
}
