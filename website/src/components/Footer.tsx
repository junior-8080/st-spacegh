import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui";
import { services } from "@/lib/services";
import { links, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand-graphite bg-brand-black text-brand-gray">
      <div aria-hidden className="bg-gold-lines pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="dark" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <p className="mt-6 font-heading text-sm font-extrabold uppercase tracking-wider text-brand-gold">
            Professional. Reliable. Efficient. Always.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Quick links</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-brand-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Services</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="transition hover:text-brand-gold">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={links.tel} className="flex items-center gap-3 transition hover:text-brand-gold">
                <Phone className="size-4 shrink-0 text-brand-gold" aria-hidden /> {links.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={links.whatsappEnquiry} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-brand-gold">
                <WhatsAppIcon className="size-4 shrink-0 text-brand-gold" /> WhatsApp {links.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={links.email} className="flex items-center gap-3 break-all transition hover:text-brand-gold">
                <Mail className="size-4 shrink-0 text-brand-gold" aria-hidden /> {site.contact.email}
              </a>
            </li>
            {site.locations.map((location) => (
              <li key={location.city} className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold" aria-hidden />
                <span>
                  <span className="font-semibold text-white">{location.city}:</span> {location.address}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-brand-gold" aria-hidden /> {site.hours}
            </li>
          </ul>
        </div>
      </Container>
      <div className="relative border-t border-brand-graphite">
        <Container className="flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p className="text-brand-gray/80">{site.slogans[0]}</p>
        </Container>
      </div>
    </footer>
  );
}
