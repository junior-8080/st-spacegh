import { ArrowRight, Check, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { Container, Gold, Ribbon, SectionHeading, buttonClass } from "@/components/ui";
import { getService, services } from "@/lib/services";
import { links } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.title} | ST-SPACE`, description: service.metaDescription },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug);
  const words = service.title.split(" ");
  const quoteHref = `/contact?service=${encodeURIComponent(service.title)}`;

  return (
    <>
      <PageHero
        ribbon="Our services"
        title={
          <>
            {words.slice(0, -1).join(" ")} <Gold>{words.at(-1)}</Gold>
          </>
        }
        description={service.intro}
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { label: service.title }]}
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href={quoteHref} className={buttonClass("gold", "lg")}>
            Request a Quote <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a href={links.tel} className={buttonClass("outline", "lg")}>
            <Phone className="size-4" aria-hidden /> {links.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Ribbon>Overview</Ribbon>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-neutral-700">
              {service.long.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <PhotoFrame icon={service.icon} alt={service.imageLabel} className="mt-10 aspect-[16/9] w-full" />
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="clip-angle relative bg-brand-black p-8 sm:p-10 lg:sticky lg:top-28">
              <div aria-hidden className="bg-gold-lines absolute inset-0" />
              <div className="relative">
                <h2 className="font-heading text-xl font-extrabold uppercase text-white">
                  What&apos;s <Gold>included</Gold>
                </h2>
                <ul className="mt-6 space-y-4">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-brand-white">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-gradient">
                        <Check className="size-3.5 text-brand-black" strokeWidth={3} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={quoteHref} className={`${buttonClass("gold", "lg")} mt-10 w-full`}>
                  Get a quote for this service
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-brand-offwhite py-20 sm:py-24">
        <Container>
          <SectionHeading ribbon="Related services" title="Explore our other services" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} index={services.indexOf(item)} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
