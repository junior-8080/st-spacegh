import { ArrowLeft, Building, Check, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { CTASection } from "@/components/CTASection";
import { FacilityCard } from "@/components/FacilityCard";
import { FacilityGallery } from "@/components/FacilityGallery";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { Container, SectionHeading, buttonClass } from "@/components/ui";
import { getFacilities, getFacility } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { links, site, whatsappLink } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/facilities/[slug]">): Promise<Metadata> {
  const facility = await getFacility((await params).slug);
  if (!facility) return { title: "Facility not found" };
  const description = facility.summary || `${facility.type} facility in ${facility.location}, managed by ST-SPACE.`;
  return {
    title: `${facility.name} – ${facility.location}`,
    description,
    alternates: { canonical: `/facilities/${facility.slug}` },
    openGraph: {
      title: `${facility.name} | ST-SPACE`,
      description,
      ...(facility.images[0] && { images: [{ url: facility.images[0] }] }),
    },
  };
}

export default async function FacilityPage({ params }: PageProps<"/facilities/[slug]">) {
  const facility = await getFacility((await params).slug);
  if (!facility) notFound();

  const others = (await getFacilities()).filter((item) => item.slug !== facility.slug).slice(0, 3);
  const price = formatPrice(facility.price, facility.pricePeriod);
  const enquiry = `Hello ST-SPACE, I'd like to enquire about ${facility.name} (${facility.location}).`;
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Enquiry: ${facility.name}`)}`;

  return (
    <>
      <PageHero
        ribbon={facility.type}
        title={facility.name}
        description={facility.summary}
        breadcrumbs={[{ href: "/", label: "Home" }, { href: "/facilities", label: "Facilities" }, { label: facility.name }]}
      >
        <p className="mt-6 flex items-center gap-2 text-white">
          <MapPin className="size-5 text-brand-gold" aria-hidden /> {facility.location}
        </p>
      </PageHero>

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <FacilityGallery images={facility.images} name={facility.name} />

            {facility.description && (
              <section>
                <h2 className="font-heading text-xl font-extrabold uppercase text-brand-black">About this facility</h2>
                <Prose content={facility.description} className="mt-4 prose-base sm:prose-lg" />
              </section>
            )}

            {facility.features.length > 0 && (
              <section>
                <h2 className="font-heading text-xl font-extrabold uppercase text-brand-black">Features & amenities</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {facility.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-neutral-700">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-gradient">
                        <Check className="size-3 text-brand-black" strokeWidth={3} aria-hidden />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-gold-ink">
              <ArrowLeft className="size-4" aria-hidden /> All facilities
            </Link>
          </div>

          <aside className="lg:col-span-5">
            <div className="clip-angle relative bg-brand-black p-8 sm:p-10 lg:sticky lg:top-28">
              <div aria-hidden className="bg-gold-lines absolute inset-0" />
              <div className="relative">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-brand-gray">Price</p>
                <p className="mt-2 font-heading text-3xl font-black text-gold-gradient">{price}</p>
                <dl className="mt-6 space-y-3 border-t border-brand-graphite pt-6 text-sm">
                  <div className="flex items-center gap-3 text-white">
                    <Building className="size-4 text-brand-gold" aria-hidden />
                    <dt className="sr-only">Type</dt>
                    <dd>{facility.type}</dd>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="size-4 text-brand-gold" aria-hidden />
                    <dt className="sr-only">Location</dt>
                    <dd>{facility.location}</dd>
                  </div>
                </dl>
                <h2 className="mt-8 font-heading text-lg font-extrabold uppercase text-white">Interested in this facility?</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                  Contact our team for viewings, availability and full details.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a href={whatsappLink(enquiry)} target="_blank" rel="noopener noreferrer" className={buttonClass("gold", "lg")}>
                    <WhatsAppIcon className="size-4" /> Enquire on WhatsApp
                  </a>
                  <a href={links.tel} className={buttonClass("outline", "lg")}>
                    <Phone className="size-4" aria-hidden /> Call {links.phoneDisplay}
                  </a>
                  <a href={mailto} className={buttonClass("outline", "lg")}>
                    <Mail className="size-4" aria-hidden /> Email us
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="bg-brand-offwhite py-20 sm:py-24">
          <Container>
            <SectionHeading ribbon="More facilities" title="Other facilities we manage" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <FacilityCard key={item.id} facility={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTASection />
    </>
  );
}
