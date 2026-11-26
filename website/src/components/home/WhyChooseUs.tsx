import { BadgeCheck, Clock, HeartHandshake, Settings2, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Container, Gold, SectionHeading } from "@/components/ui";

export const reasons: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Experienced & Trained Team", text: "Skilled technicians and supervisors who know facilities inside out.", icon: Users },
  { title: "24/7 Reliability", text: "Round-the-clock support when your building needs us most.", icon: Clock },
  { title: "Tailored Solutions", text: "Service plans built around your property, people and budget.", icon: Settings2 },
  { title: "Quality Assured", text: "Clear standards, checklists and supervision on every job.", icon: BadgeCheck },
  { title: "Customer Satisfaction Driven", text: "Responsive communication and a single accountable partner.", icon: HeartHandshake },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-brand-black py-20 sm:py-28">
      <div aria-hidden className="bg-gold-lines absolute inset-0" />
      <Container className="relative">
        <SectionHeading
          tone="dark"
          ribbon="Why choose us?"
          title={
            <>
              Professional. Reliable. <Gold>Efficient.</Gold> Always.
            </>
          }
          description="We combine trained people, proven processes and genuine care for your space, so you can rely on one partner for everything."
        />
        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((reason, index) => (
            <Reveal
              as="li"
              key={reason.title}
              delay={index * 90}
              className="group relative px-6 py-8 text-center lg:border-l lg:border-brand-gold/30 lg:first:border-l-0 max-lg:border-b max-lg:border-brand-gold/20 sm:max-lg:odd:border-r"
            >
              <span className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-brand-gold text-brand-gold transition duration-300 group-hover:bg-brand-gold group-hover:text-brand-black">
                <reason.icon className="size-7" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-5 font-heading text-sm font-extrabold uppercase leading-snug tracking-wide text-white">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">{reason.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
