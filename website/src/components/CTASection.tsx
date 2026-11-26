import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { Container, Gold, buttonClass } from "@/components/ui";
import { links } from "@/lib/site";

type CTASectionProps = { title?: React.ReactNode; text?: string };

export function CTASection({ title, text }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-brand-charcoal py-20 sm:py-24">
      <div aria-hidden className="bg-gold-lines absolute inset-0" />
      <div aria-hidden className="absolute -left-20 top-0 h-full w-72 -skew-x-[25deg] bg-gold-gradient opacity-[0.08]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-4xl font-heading text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
          {title ?? (
            <>
              Let us take care of <Gold>your space</Gold> so you can focus on <Gold>what matters.</Gold>
            </>
          )}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-brand-gray">
          {text ?? "Talk to our team today for a free consultation and a tailored quote. We respond quickly, 24/7."}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a href={links.tel} className={buttonClass("gold", "lg")}>
            <Phone className="size-4" aria-hidden /> Call {links.phoneDisplay}
          </a>
          <a href={links.whatsappEnquiry} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
            <WhatsAppIcon className="size-4" /> WhatsApp us
          </a>
          <a href={links.email} className={buttonClass("outline", "lg")}>
            <Mail className="size-4" aria-hidden /> Email us
          </a>
        </div>
      </Container>
    </section>
  );
}
