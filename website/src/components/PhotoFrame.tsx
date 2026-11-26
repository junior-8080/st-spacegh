import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/format";

type PhotoFrameProps = {
  /** Path in /public/images. When omitted, a branded placeholder block is shown. */
  src?: string;
  alt: string;
  icon: LucideIcon;
  className?: string;
  sizes?: string;
  priority?: boolean;
  shape?: "angle" | "hex" | "plain";
};

const shapes = { angle: "clip-angle", hex: "clip-hex", plain: "" };

/**
 * Image frame with the flyer's angled edges.
 * TODO: replace with client photo — pass `src` (e.g. "/images/hvac.jpg") once real photography is available.
 */
export function PhotoFrame({ src, alt, icon: Icon, className, sizes = "(min-width: 1024px) 50vw, 100vw", priority, shape = "angle" }: PhotoFrameProps) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-charcoal", shapes[shape], className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#2a2a2a_0%,#141414_45%,#0a0a0a_100%)]" />
          <div className="bg-gold-lines absolute inset-0" />
          <div className="absolute -right-10 bottom-0 h-2/3 w-1/2 skew-x-[-20deg] bg-gradient-to-t from-brand-gold/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-2xl border border-brand-gold/50 bg-brand-black/60 text-brand-gold backdrop-blur-sm sm:size-20">
              <Icon className="size-8 sm:size-10" strokeWidth={1.5} aria-hidden />
            </span>
          </div>
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  );
}
