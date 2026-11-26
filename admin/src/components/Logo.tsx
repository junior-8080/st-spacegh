// TODO: replace with client's official vector logo
import { useId } from "react";
import { cn } from "@/lib/format";

export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${id}-a`} x1="8" y1="6" x2="54" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD54A" />
          <stop offset=".5" stopColor="#F2B705" />
          <stop offset="1" stopColor="#C8930A" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="56" y1="58" x2="10" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD54A" />
          <stop offset=".55" stopColor="#F2B705" />
          <stop offset="1" stopColor="#C8930A" />
        </linearGradient>
      </defs>
      <path d="M54 6H20L8 18v10l18 10h16L22 27v-6l5-5h21z" fill={`url(#${id}-a)`} />
      <path d="M8 18v10l18 10h5L14 28v-8z" fill="#0A0A0A" fillOpacity=".35" />
      <path d="M10 58h34l12-12V36L38 26H22l20 11v6l-5 5H16z" fill={`url(#${id}-b)`} />
      <path d="M56 46V36L38 26h-5l17 10v8z" fill="#0A0A0A" fillOpacity=".35" />
    </svg>
  );
}

type LogoProps = {
  /** "dark" = for dark backgrounds (white wordmark); "light" = for light backgrounds. */
  variant?: "dark" | "light";
  subtitle?: string;
  className?: string;
};

export function Logo({ variant = "dark", subtitle = "Facilities Management Services", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-extrabold tracking-tight",
            variant === "dark" ? "text-white" : "text-brand-black",
          )}
        >
          ST-SPACE
        </span>
        <span
          className={cn(
            "mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em]",
            variant === "dark" ? "text-brand-gray" : "text-neutral-500",
          )}
        >
          {subtitle}
        </span>
      </span>
    </span>
  );
}
