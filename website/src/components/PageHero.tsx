import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Ribbon } from "@/components/ui";

type PageHeroProps = {
  ribbon: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs: Array<{ href?: string; label: string }>;
  children?: ReactNode;
};

/** Dark hero band used at the top of inner pages. */
export function PageHero({ ribbon, title, description, breadcrumbs, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div aria-hidden className="bg-gold-lines absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -right-24 top-10 -z-10 h-80 w-80 rotate-45 border border-brand-gold/20" />
      <div aria-hidden className="absolute -right-8 top-28 -z-10 h-48 w-48 rotate-45 border border-brand-gold/10" />
      <div aria-hidden className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-brand-gold/60 via-brand-gold/20 to-transparent" />
      <Container>
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gray">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="size-3.5 text-brand-gold" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition hover:text-brand-gold">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Ribbon>{ribbon}</Ribbon>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-black uppercase leading-[1.08] tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray">{description}</p>}
        {children}
      </Container>
    </section>
  );
}
