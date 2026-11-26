import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { Container, Gold, IconTile, buttonClass } from "@/components/ui";
import { cn } from "@/lib/format";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Facility management, asset and property management, project and support services, and fumigation for businesses and homes in Accra and Kumasi.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        ribbon="Our services"
        title={
          <>
            One partner. All solutions. <Gold>Exceptional results.</Gold>
          </>
        }
        description="Everything your property needs to stay safe, efficient and productive, delivered by one accountable team."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="space-y-24 sm:space-y-32">
          {services.map((service, index) => (
            <article key={service.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal className={cn(index % 2 === 1 && "lg:order-2")}>
                <PhotoFrame icon={service.icon} alt={service.imageLabel} className="aspect-[4/3] w-full" />
              </Reveal>
              <Reveal delay={120}>
                <div className="flex items-center gap-4">
                  <IconTile>
                    <service.icon className="size-7" strokeWidth={1.75} aria-hidden />
                  </IconTile>
                  <span className="font-heading text-5xl font-black text-neutral-200">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-6 font-heading text-3xl font-extrabold uppercase leading-tight text-brand-black">{service.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-neutral-600">{service.intro}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.included.slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-brand-black">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-gradient">
                        <Check className="size-3 text-brand-black" strokeWidth={3} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${service.slug}`} className={cn(buttonClass("dark", "lg"), "mt-8")}>
                  Explore {service.title} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            </article>
          ))}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
