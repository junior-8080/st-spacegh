import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const redirectTo = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-black px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rotate-45 border border-brand-gold/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rotate-45 border border-brand-gold/10"
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="dark" />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 h-1 w-12 rounded-full bg-gold-gradient" />
          <h1 className="font-heading text-2xl font-extrabold text-neutral-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage blog posts, job vacancies and enquiries.</p>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
