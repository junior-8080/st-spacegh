import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export type ButtonVariant = "gold" | "outline" | "outline-dark" | "dark";

const variants: Record<ButtonVariant, string> = {
  gold: "bg-gold-gradient text-brand-black shadow-[0_8px_24px_-8px_rgb(242_183_5/0.55)] hover:shadow-[0_12px_32px_-8px_rgb(242_183_5/0.7)] hover:brightness-105",
  outline: "border border-white/40 text-white hover:border-brand-gold hover:text-brand-gold",
  "outline-dark": "border border-brand-black/25 text-brand-black hover:border-brand-black hover:bg-brand-black hover:text-white",
  dark: "bg-brand-black text-white hover:bg-brand-graphite",
};

export function buttonClass(variant: ButtonVariant = "gold", size: "md" | "lg" = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-heading font-bold uppercase tracking-wider transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-13 px-7 text-sm" : "h-11 px-5 text-xs",
    variants[variant],
  );
}

const containerSizes = { default: "max-w-7xl", narrow: "max-w-4xl", prose: "max-w-3xl" };

export function Container({
  className,
  size = "default",
  children,
}: {
  className?: string;
  size?: keyof typeof containerSizes;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", containerSizes[size], className)}>{children}</div>;
}

/** Gold gradient "ribbon" label used above section headings, as on the flyer. */
export function Ribbon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "clip-angle-sm inline-block bg-gold-gradient py-1.5 pl-4 pr-6 font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-brand-black",
        className,
      )}
    >
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  ribbon: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ ribbon, title, description, tone = "light", align = "center", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Ribbon>{ribbon}</Ribbon>
      <h2
        className={cn(
          "mt-5 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl",
          tone === "dark" ? "text-white" : "text-brand-black",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-brand-gray" : "text-neutral-600")}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Gold key word inside a headline. */
export function Gold({ children }: { children: ReactNode }) {
  return <span className="text-gold-gradient">{children}</span>;
}

/** Icon in a gold-outlined rounded square, as used for service items. */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-brand-gold bg-brand-black text-brand-gold transition duration-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Circular gold-ringed badge with a short tagline. */
export function CircleBadge({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-28 items-center justify-center rounded-full bg-gold-gradient p-1 shadow-2xl shadow-black/50 sm:size-36",
        className,
      )}
    >
      <div className="flex size-full flex-col items-center justify-center rounded-full border-2 border-brand-gold/60 bg-brand-black p-3 text-center">
        {lines.map((line, index) => (
          <span
            key={line}
            className={cn(
              "font-heading text-[0.62rem] font-extrabold uppercase leading-tight tracking-wider sm:text-[0.7rem]",
              index === lines.length - 1 ? "text-brand-gold" : "text-white",
            )}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
