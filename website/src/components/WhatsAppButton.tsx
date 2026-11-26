import { WhatsAppIcon } from "@/components/BrandIcons";
import { links } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={links.whatsappEnquiry}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ST-SPACE on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-gold-gradient p-[3px] shadow-[0_10px_30px_-5px_rgb(0_0_0/0.6)] transition hover:scale-105 sm:bottom-7 sm:right-7 sm:size-16"
    >
      <span className="flex size-full items-center justify-center rounded-full bg-brand-black text-brand-gold transition group-hover:bg-brand-charcoal">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  );
}
