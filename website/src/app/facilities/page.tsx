import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { FacilityCard } from "@/components/FacilityCard";
import { PageHero } from "@/components/PageHero";
import { Container, Gold } from "@/components/ui";
import { getFacilities } from "@/lib/api";
import { cn } from "@/lib/format";
import { FACILITY_TYPES } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Facilities We Manage",
  description:
    "Explore offices, residential estates, warehouses and other facilities managed by ST-SPACE in Accra and Kumasi, with photos and pricing.",
  alternates: { canonical: "/facilities" },
};

export default async function FacilitiesPage({ searchParams }: PageProps<"/facilities">) {
  const query = await searchParams;
  const type = FACILITY_TYPES.find((t) => t === query.type);
  const [facilities, all] = await Promise.all([getFacilities({ type }), type ? getFacilities() : null]);
  // Only offer filter chips for types that actually have listings.
  const availableTypes = FACILITY_TYPES.filter((t) => (all ?? facilities).some((facility) => facility.type === t));

  return (
    <>
      <PageHero
        ribbon="Our facilities"
        title={
          <>
            Facilities we <Gold>manage</Gold>
          </>
        }
        description="A selection of the properties and facilities in our care: professionally maintained, safe and ready for business."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Facilities" }]}
      />

      <section className="bg-brand-offwhite py-16 sm:py-24">
        <Container>
          {availableTypes.length > 1 && (
            <nav aria-label="Facility types" className="mb-12">
              <ul className="flex flex-wrap gap-2">
                {[undefined, ...availableTypes].map((item) => {
                  const active = item === type;
                  return (
                    <li key={item ?? "all"}>
                      <Link
                        href={item ? `/facilities?type=${encodeURIComponent(item)}` : "/facilities"}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex h-10 items-center rounded-full border px-5 text-sm font-semibold transition",
                          active
                            ? "border-brand-black bg-brand-black text-brand-gold"
                            : "border-neutral-300 bg-white text-brand-black hover:border-brand-gold",
                        )}
                      >
                        {item ?? "All facilities"}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {facilities.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
              <Building2 className="mx-auto size-12 text-brand-gold-dark" strokeWidth={1.25} aria-hidden />
              <h2 className="mt-5 font-heading text-xl font-extrabold uppercase text-brand-black">No facilities listed yet</h2>
              <p className="mt-2 text-neutral-600">
                {type ? "There are no facilities of this type yet." : "Our facilities will be listed here soon."}
              </p>
            </div>
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
