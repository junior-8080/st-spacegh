import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { IconTile } from "@/components/ui";
import type { Service } from "@/lib/services";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold-gradient transition duration-500 group-hover:scale-x-100" />
      <span aria-hidden className="absolute right-6 top-5 font-heading text-5xl font-black text-neutral-100 transition group-hover:text-brand-gold/15">
        {String(index + 1).padStart(2, "0")}
      </span>
      <IconTile className="group-hover:shadow-[0_0_0_6px_rgb(242_183_5/0.15)]">
        <Icon className="size-7" strokeWidth={1.75} aria-hidden />
      </IconTile>
      <h3 className="mt-6 font-heading text-lg font-extrabold uppercase leading-snug text-brand-black">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{service.short}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-brand-black">
        Learn more
        <ArrowRight className="size-4 text-brand-gold-dark transition group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
