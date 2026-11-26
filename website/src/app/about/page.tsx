import {
  BarChart3,
  ClipboardCheck,
  Eye,
  HardHat,
  Lightbulb,
  MapPin,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { CircleBadge, Container, Gold, IconTile, Ribbon, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ST-SPACE is a Ghanaian facilities management company with offices in Accra and Kumasi, delivering maintenance, property management, project support and fumigation services.",
  alternates: { canonical: "/about" },
};

const values: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Professionalism", text: "Trained, uniformed teams who respect your premises and your people.", icon: Trophy },
  { title: "Reliability", text: "We show up on schedule and respond quickly when the unexpected happens.", icon: Timer },
  { title: "Efficiency", text: "Well-planned work that saves you time, energy and money.", icon: Lightbulb },
  { title: "Safety", text: "Safe methods, proper equipment and strict procedures on every job.", icon: ShieldCheck },
  { title: "Integrity", text: "Honest advice, transparent reporting and fair pricing.", icon: Scale },
];

const steps: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Assess", text: "We inspect your facility, understand how it is used and identify risks and priorities.", icon: Search },
  { title: "Plan", text: "We agree a clear scope, schedule and service levels tailored to your property and budget.", icon: ClipboardCheck },
  { title: "Execute", text: "Our trained teams deliver the work to standard, safely and with minimal disruption.", icon: Rocket },
  { title: "Monitor", text: "We track performance, report regularly and keep improving the service.", icon: BarChart3 },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        ribbon="About us"
        title={
          <>
            Your space. <Gold>Our priority.</Gold>
          </>
        }
        description={site.description}
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Ribbon>Our story</Ribbon>
            <h2 className="mt-5 font-heading text-3xl font-extrabold uppercase leading-tight text-brand-black sm:text-4xl">
              One partner for the spaces that matter to you
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-neutral-600">
              <p>
                ST-SPACE Facilities Management Services was established to give property owners and organisations in Ghana a
                single, dependable partner for the care of their buildings. Too often, maintenance, cleaning, pest control and
                project work are split across many providers, with no one taking full responsibility. We set out to change that.
              </p>
              <p>
                Today, from our offices in Accra and Kumasi, we serve offices, residential estates, schools, healthcare
                facilities, hotels and warehouses. Our teams combine practical technical skill with a strong service culture,
                so our clients can concentrate on running their organisations while we look after their spaces.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <PhotoFrame icon={HardHat} alt="ST-SPACE team at work on a client site" className="aspect-[4/3] w-full" />
            <CircleBadge
              lines={["Professional.", "Reliable.", "Efficient."]}
              className="absolute -bottom-8 -left-4 sm:-left-8"
            />
          </Reveal>
        </Container>
      </section>

      <section className="bg-brand-offwhite py-20 sm:py-24">
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our mission",
              text: "To deliver comprehensive, innovative and reliable facilities management solutions that keep our clients' property, assets and people safe, efficient and productive.",
            },
            {
              icon: Eye,
              title: "Our vision",
              text: "To be the most trusted facilities management partner in Ghana, recognised for professional service, dependable people and exceptional results.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 100} className="clip-angle relative bg-brand-black p-8 sm:p-10">
              <div aria-hidden className="bg-gold-lines absolute inset-0" />
              <div className="relative">
                <IconTile>
                  <item.icon className="size-7" strokeWidth={1.75} aria-hidden />
                </IconTile>
                <h2 className="mt-6 font-heading text-2xl font-extrabold uppercase text-white">{item.title}</h2>
                <p className="mt-4 leading-relaxed text-brand-gray">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            ribbon="Our values"
            title="What we stand for"
            description="Five principles guide how we work on every site, for every client."
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value, index) => (
              <Reveal
                as="li"
                key={value.title}
                delay={index * 70}
                className="border border-neutral-200 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-lg"
              >
                <value.icon className="size-8 text-brand-gold-dark" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 font-heading text-sm font-extrabold uppercase tracking-wide text-brand-black">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{value.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-brand-black py-20 sm:py-28">
        <div aria-hidden className="bg-gold-lines absolute inset-0" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            ribbon="How we work"
            title={
              <>
                A clear process. <Gold>Consistent results.</Gold>
              </>
            }
          />
          <div className="relative mt-16">
            <div aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent lg:block" />
          <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 120} className="relative text-center">
                <span className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-gold-gradient text-brand-black shadow-[0_0_0_8px_#0a0a0a]">
                  <step.icon className="size-7" strokeWidth={2} aria-hidden />
                </span>
                <p className="mt-6 font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Step {index + 1}</p>
                <h3 className="mt-2 font-heading text-xl font-extrabold uppercase text-white">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-brand-gray">{step.text}</p>
              </Reveal>
            ))}
          </ol>
          </div>
        </Container>
      </section>

      <section className="bg-brand-offwhite py-20 sm:py-24">
        <Container>
          <SectionHeading ribbon="Our locations" title="Serving clients across Ghana" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {site.locations.map((location) => (
              <div key={location.city} className="flex items-start gap-5 border border-neutral-200 bg-white p-7">
                <IconTile>
                  <MapPin className="size-6" aria-hidden />
                </IconTile>
                <div>
                  <h3 className="font-heading text-lg font-extrabold uppercase text-brand-black">{location.city} office</h3>
                  <p className="mt-1 text-neutral-600">{location.address}</p>
                  <p className="mt-2 text-sm font-semibold text-brand-black">{site.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TODO: client testimonials / partner logos. Hidden until real, approved content is available. */}

      <CTASection />
    </>
  );
}
