import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { Container, Gold, IconTile, Ribbon } from "@/components/ui";
import { SERVICE_OPTIONS } from "@/lib/services";
import { links, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us & Request a Quote",
  description:
    "Contact ST-SPACE Facilities Management Services in Accra or Kumasi. Call 0244370672, WhatsApp +233205935800 or send us a message for a free quote.",
  alternates: { canonical: "/contact" },
};

type Channel = { title: string; value: string; href: string; icon: LucideIcon | typeof WhatsAppIcon; external?: boolean };

const channels: Channel[] = [
  { title: "Call us", value: links.phoneDisplay, href: links.tel, icon: Phone },
  { title: "WhatsApp", value: links.whatsappDisplay, href: links.whatsappEnquiry, icon: WhatsAppIcon, external: true },
  { title: "Email", value: site.contact.email, href: links.email, icon: Mail },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;
  const defaultService = SERVICE_OPTIONS.find((option) => option === service) ?? "";

  return (
    <>
      <PageHero
        ribbon="Contact us"
        title={
          <>
            Let&apos;s talk about <Gold>your space</Gold>
          </>
        }
        description="Request a quote, book an inspection or ask a question. Our team is available 24/7 and will respond quickly."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      <section className="bg-brand-offwhite py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                {...(channel.external && { target: "_blank", rel: "noopener noreferrer" })}
                className="group flex items-center gap-5 border border-neutral-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-lg"
              >
                <IconTile className="group-hover:bg-gold-gradient group-hover:text-brand-black">
                  <channel.icon className="size-6" aria-hidden />
                </IconTile>
                <span className="min-w-0">
                  <span className="block font-heading text-xs font-bold uppercase tracking-wider text-neutral-500">{channel.title}</span>
                  <span className="mt-1 block break-all font-heading text-base font-extrabold text-brand-black">{channel.value}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-10 lg:col-span-7">
              <Ribbon>Request a quote</Ribbon>
              <h2 className="mt-5 font-heading text-2xl font-extrabold uppercase text-brand-black sm:text-3xl">Send us a message</h2>
              <p className="mb-8 mt-2 text-neutral-600">Fill in the form and we&apos;ll get back to you with the next steps.</p>
              <ContactForm defaultService={defaultService} />
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="clip-angle relative bg-brand-black p-8">
                <div aria-hidden className="bg-gold-lines absolute inset-0" />
                <div className="relative flex items-start gap-4">
                  <Clock className="size-7 shrink-0 text-brand-gold" aria-hidden />
                  <div>
                    <h2 className="font-heading text-lg font-extrabold uppercase text-white">Business hours</h2>
                    <p className="mt-1 text-brand-gray">Open 24 hours, 7 days a week.</p>
                    <p className="mt-1 text-sm font-semibold text-brand-gold">{site.hours}</p>
                  </div>
                </div>
              </div>

              {site.locations.map((location) => {
                const query = encodeURIComponent(`${location.address}, ${location.city}, Ghana`);
                return (
                  <div key={location.city} className="overflow-hidden border border-neutral-200 bg-white">
                    <div className="flex items-start gap-3 p-5">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-brand-gold-dark" aria-hidden />
                      <div>
                        <h2 className="font-heading text-base font-extrabold uppercase text-brand-black">{location.city} office</h2>
                        <p className="text-sm text-neutral-600">{location.address}</p>
                      </div>
                    </div>
                    {/* TODO: replace the search embed with the client's exact Google Maps pin */}
                    <iframe
                      title={`Map of the ST-SPACE ${location.city} office`}
                      src={`https://www.google.com/maps?q=${query}&output=embed`}
                      className="h-56 w-full border-0 grayscale-[30%]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
