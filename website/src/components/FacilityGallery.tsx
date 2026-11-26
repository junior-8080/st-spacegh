"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FacilityImage } from "@/components/FacilityImage";
import { cn } from "@/lib/format";

/** Main image with thumbnail strip and previous/next controls. */
export function FacilityGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (step: number) => setActive((index) => (index + step + count) % count);

  return (
    <div>
      <div className="relative">
        <FacilityImage
          src={images[active]}
          alt={count > 1 ? `${name}, photo ${active + 1} of ${count}` : name}
          sizes="(min-width: 1024px) 60vw, 100vw"
          preload
          className="clip-angle aspect-[16/10] w-full"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-black/80 text-white transition hover:bg-brand-gold hover:text-brand-black"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-black/80 text-white transition hover:bg-brand-gold hover:text-brand-black"
            >
              <ChevronRight className="size-5" />
            </button>
            <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-0.5 text-xs font-semibold text-white" aria-live="polite">
              {active + 1} / {count}
            </p>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "block w-full overflow-hidden ring-2 ring-offset-2 transition",
                  index === active ? "ring-brand-gold" : "ring-transparent opacity-70 hover:opacity-100",
                )}
              >
                <FacilityImage src={image} alt="" sizes="120px" className="aspect-[4/3]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
