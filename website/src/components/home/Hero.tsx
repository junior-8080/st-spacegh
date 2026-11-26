import { AirVent, ArrowRight, Building2, Leaf, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { PhotoFrame } from "@/components/PhotoFrame";
import { CircleBadge, Container, Gold, buttonClass } from "@/components/ui";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black pb-20 pt-32 sm:pt-40 lg:pb-28">
      <div aria-hidden className="bg-gold-lines absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -right-40 top-0 -z-10 h-full w-2/3 bg-[radial-gradient(closest-side,rgb(242_183_5/0.12),transparent)]" />
      <div aria-hidden className="absolute bottom-0 left-0 -z-10 h-px w-full bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="mb-6 inline-flex items-center gap-3 font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
            <span aria-hidden className="h-px w-10 bg-brand-gold" />
            Facilities Management · Accra & Kumasi
          </p>
          <h1 className="font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
            We manage spaces. You focus on <Gold>success.</Gold>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-gray">{site.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className={buttonClass("gold", "lg")}>
              Request a Quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/services" className={buttonClass("outline", "lg")}>
              Our Services
            </Link>
          </div>
          <ul className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-brand-graphite pt-6 text-xs font-semibold uppercase tracking-wider text-brand-gray">
            <li>
              <span className="block font-heading text-lg font-extrabold text-white">24/7</span>
              Support
            </li>
            <li>
              <span className="block font-heading text-lg font-extrabold text-white">2</span>
              Regional offices
            </li>
            <li>
              <span className="block font-heading text-lg font-extrabold text-white">1</span>
              Partner for all
            </li>
          </ul>
        </div>

        {/* Angled photo collage. TODO: replace with client photos of staff at work */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: "1 / 1" }}>
            <PhotoFrame
              icon={Building2}
              alt="Modern glass office building managed by ST-SPACE"
              className="col-span-4 row-span-4"
              sizes="(min-width: 1024px) 33vw, 66vw"
              priority
            />
            <PhotoFrame icon={AirVent} alt="Technician servicing an air-conditioning unit" shape="hex" className="col-span-2 row-span-2" sizes="20vw" />
            <PhotoFrame icon={Zap} alt="Electrician carrying out electrical maintenance" className="col-span-2 row-span-2" sizes="20vw" />
            <PhotoFrame icon={Sparkles} alt="Cleaner cleaning office glass" shape="hex" className="col-span-2 row-span-2" sizes="20vw" />
            <PhotoFrame icon={Leaf} alt="Groundskeeper maintaining landscaping" className="col-span-4 row-span-2 clip-angle-sm" shape="plain" sizes="(min-width: 1024px) 33vw, 66vw" />
          </div>
          <CircleBadge
            lines={["Your space.", "Our priority."]}
            className="absolute left-[50%] top-[66.6%] -translate-x-1/2 -translate-y-1/2"
          />
          <div aria-hidden className="absolute -right-3 -top-3 h-24 w-24 border-r-2 border-t-2 border-brand-gold/70" />
        </div>
      </Container>
    </section>
  );
}
