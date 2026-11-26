import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { Container, Gold, buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-brand-black pb-20 pt-36">
      <div aria-hidden className="bg-gold-lines absolute inset-0 -z-10" />
      <Container className="text-center">
        <p className="font-heading text-8xl font-black text-gold-gradient sm:text-9xl">404</p>
        <h1 className="mt-6 font-heading text-3xl font-black uppercase text-white sm:text-4xl">
          This space is <Gold>empty</Gold>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-brand-gray">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className={buttonClass("gold", "lg")}>
            <Home className="size-4" aria-hidden /> Back to home
          </Link>
          <Link href="/contact" className={buttonClass("outline", "lg")}>
            Contact us <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
