import { ArrowRight, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { FacilityImage } from "@/components/FacilityImage";
import { formatPrice } from "@/lib/format";
import type { FacilitySummary } from "@/types";

export function FacilityCard({ facility }: { facility: FacilitySummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl">
      <div className="relative">
        <FacilityImage
          src={facility.images[0]}
          alt={facility.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3]"
          imageClassName="transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 bg-brand-black/90 px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-wider text-brand-gold">
          {facility.type}
        </span>
        {facility.featured && (
          <span className="absolute right-4 top-4 flex items-center gap-1 bg-gold-gradient px-2.5 py-1 font-heading text-[0.65rem] font-extrabold uppercase tracking-wider text-brand-black">
            <Star className="size-3 fill-current" aria-hidden /> Featured
          </span>
        )}
        {facility.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-sm bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            {facility.images.length} photos
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-sm text-neutral-600">
          <MapPin className="size-4 shrink-0 text-brand-gold-dark" aria-hidden /> {facility.location}
        </p>
        <h3 className="mt-2 font-heading text-lg font-extrabold leading-snug text-brand-black">
          <Link href={`/facilities/${facility.slug}`} className="after:absolute after:inset-0">
            {facility.name}
          </Link>
        </h3>
        {facility.summary && <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{facility.summary}</p>}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4">
          <p className="font-heading text-base font-extrabold text-brand-black">{formatPrice(facility.price, facility.pricePeriod)}</p>
          <ArrowRight className="size-5 shrink-0 text-brand-gold-dark transition group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </article>
  );
}
