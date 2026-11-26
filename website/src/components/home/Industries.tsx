import { Building, GraduationCap, Home, Hotel, Stethoscope, Warehouse } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Container, SectionHeading } from "@/components/ui";

const industries = [
  { label: "Corporate Offices", icon: Building },
  { label: "Residential Estates", icon: Home },
  { label: "Schools", icon: GraduationCap },
  { label: "Healthcare", icon: Stethoscope },
  { label: "Hospitality", icon: Hotel },
  { label: "Warehouses & Industrial", icon: Warehouse },
];

export function Industries() {
  return (
    <section className="bg-brand-offwhite py-20 sm:py-28">
      <Container>
        <SectionHeading
          ribbon="Industries we serve"
          title="Built for every kind of space"
          description="From busy corporate towers to quiet residential estates, our teams adapt to the standards and rhythms of each environment."
        />
        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {industries.map((industry, index) => (
            <Reveal
              as="li"
              key={industry.label}
              delay={index * 60}
              className="group flex flex-col items-center gap-4 border border-neutral-200 bg-white px-4 py-8 text-center transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-lg"
            >
              <industry.icon className="size-9 text-brand-gold-dark transition group-hover:scale-110" strokeWidth={1.5} aria-hidden />
              <span className="font-heading text-xs font-extrabold uppercase leading-snug tracking-wide text-brand-black">
                {industry.label}
              </span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
