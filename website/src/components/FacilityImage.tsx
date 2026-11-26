import { Building2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/format";

type FacilityImageProps = {
  src?: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
};

/** A facility photo (public Cloudflare R2 URL uploaded in the admin), or a branded placeholder when none has been uploaded. */
export function FacilityImage({ src, alt, sizes, preload, className, imageClassName }: FacilityImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-charcoal", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div role="img" aria-label={`${alt} (photo coming soon)`} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#2a2a2a_0%,#141414_45%,#0a0a0a_100%)]" />
          <div className="bg-gold-lines absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="size-10 text-brand-gold/70" strokeWidth={1.25} aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
}
