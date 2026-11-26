"use client";

import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { buttonClass } from "@/components/ui";
import { cn } from "@/lib/format";
import { links, nav } from "@/lib/site";

type HeaderProps = { services: Array<{ slug: string; title: string; short: string }> };

export function Header({ services }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Tied to the path it was opened on, so the drawer closes automatically after navigation.
  const drawerOpen = drawerPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDrawerPath(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setServicesOpen(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || drawerOpen
          ? "bg-brand-black/95 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] backdrop-blur"
          : "bg-gradient-to-b from-black/60 to-transparent",
      )}
    >
      <div aria-hidden className={cn("h-0.5 bg-gold-gradient transition-opacity", scrolled ? "opacity-100" : "opacity-0")} />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="ST-SPACE home" className="shrink-0">
          <Logo variant="dark" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.href === "/services" ? (
                <li
                  key={item.href}
                  ref={servicesRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="flex items-center">
                    <Link
                      href="/services"
                      className={cn(
                        "py-2 pl-3 text-sm font-semibold transition hover:text-brand-gold",
                        isActive(item.href) ? "text-brand-gold" : "text-white",
                      )}
                    >
                      Services
                    </Link>
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="services-menu"
                      aria-label="Show services"
                      onClick={() => setServicesOpen((open) => !open)}
                      className="py-2 pl-1 pr-3 text-white hover:text-brand-gold"
                    >
                      <ChevronDown className={cn("size-4 transition", servicesOpen && "rotate-180")} aria-hidden />
                    </button>
                  </div>
                  <div
                    id="services-menu"
                    className={cn(
                      "absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3 transition duration-200",
                      servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <ul className="overflow-hidden rounded-md border border-brand-graphite bg-brand-charcoal p-2 shadow-2xl">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            onClick={() => setServicesOpen(false)}
                            className="block rounded px-4 py-3 transition hover:bg-brand-graphite"
                          >
                            <span className="block font-heading text-sm font-bold text-white">{service.title}</span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-brand-gray">{service.short}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "px-2.5 py-2 text-sm font-semibold transition hover:text-brand-gold xl:px-3",
                      isActive(item.href) ? "text-brand-gold" : "text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <a href={links.tel} className="hidden items-center gap-2 text-sm font-semibold text-white transition hover:text-brand-gold xl:flex">
            <Phone className="size-4 text-brand-gold" aria-hidden />
            {links.phoneDisplay}
          </a>
          <Link href="/contact" className={cn(buttonClass("gold"), "max-sm:hidden")}>
            Get a Quote
          </Link>
          <button
            type="button"
            className="rounded p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
            onClick={() => setDrawerPath(pathname)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile slide-in drawer (outside <header>: its backdrop-filter would trap fixed children) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", drawerOpen ? "visible" : "invisible")}>
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={drawerOpen ? 0 : -1}
          onClick={() => setDrawerPath(null)}
          className={cn("absolute inset-0 bg-black/70 transition-opacity duration-300", drawerOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-l border-brand-graphite bg-brand-black transition-transform duration-300",
            drawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-brand-graphite px-5">
            <Logo variant="dark" />
            <button type="button" aria-label="Close menu" onClick={() => setDrawerPath(null)} className="rounded p-2 text-white">
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 px-5 py-6">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded px-3 py-3 font-heading text-base font-bold uppercase tracking-wide",
                      isActive(item.href) ? "text-brand-gold" : "text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/services" && (
                    <ul className="mb-2 ml-3 border-l border-brand-graphite pl-3">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link href={`/services/${service.slug}`} className="block px-2 py-2 text-sm text-brand-gray hover:text-brand-gold">
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-brand-graphite p-5">
            <Link href="/contact" className={cn(buttonClass("gold", "lg"), "w-full")}>
              Get a Quote
            </Link>
            <a href={links.tel} className={cn(buttonClass("outline", "lg"), "w-full")}>
              <Phone className="size-4" aria-hidden /> Call {links.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
