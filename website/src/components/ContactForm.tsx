"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import { buttonClass } from "@/components/ui";
import { ADMIN_API_URL } from "@/lib/api";
import { cn } from "@/lib/format";
import { SERVICE_OPTIONS } from "@/lib/services";
import { links } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Please enter your name" }).max(100),
  email: z.email({ error: "Please enter a valid email address" }),
  phone: z
    .string()
    .trim()
    .min(7, { error: "Please enter a valid phone number" })
    .max(30)
    .regex(/^[+\d][\d\s()-]+$/, { error: "Please enter a valid phone number" }),
  company: z.string().trim().max(150).optional(),
  service: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, { error: "Please tell us a little more (at least 10 characters)" }).max(5000),
});

type FormValues = { name: string; email: string; phone: string; company: string; service: string; message: string; website: string };
const initialValues: FormValues = { name: "", email: "", phone: "", company: "", service: "", message: "", website: "" };

const inputClass =
  "block w-full rounded-sm border border-neutral-300 bg-white px-4 py-3 text-brand-black placeholder:text-neutral-400 transition focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30 aria-[invalid=true]:border-red-600";

export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [values, setValues] = useState<FormValues>({ ...initialValues, service: defaultService });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const name = event.target.name as keyof FormValues;
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      const response = await fetch(`${ADMIN_API_URL}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: values.website }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "We couldn't send your message.");
      }
      setStatus("success");
      setValues({ ...initialValues });
    } catch (error) {
      setServerError(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "We couldn't send your message.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center px-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-gold-gradient">
          <CheckCircle2 className="size-8 text-brand-black" aria-hidden />
        </span>
        <h3 className="mt-6 font-heading text-2xl font-extrabold uppercase text-brand-black">Thank you!</h3>
        <p className="mt-3 max-w-md text-neutral-600">
          Your message has been received. A member of our team will get back to you shortly. For urgent requests, call us on{" "}
          <a href={links.tel} className="font-semibold text-brand-black underline decoration-brand-gold decoration-2 underline-offset-4">
            {links.phoneDisplay}
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus("idle")} className={cn(buttonClass("outline-dark"), "mt-8")}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof FormValues) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: inputClass,
  });

  const error = (name: keyof FormValues) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="mt-1.5 text-sm font-medium text-red-700">
        {errors[name]}
      </p>
    );

  const label = (name: keyof FormValues, text: string, optional = false) => (
    <label htmlFor={`contact-${name}`} className="mb-2 block text-sm font-semibold text-brand-black">
      {text}
      {optional ? <span className="font-normal text-neutral-500"> (optional)</span> : <span className="text-red-700"> *</span>}
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>
            {serverError} Please try again, or reach us directly on{" "}
            <a href={links.tel} className="font-semibold underline">
              {links.phoneDisplay}
            </a>{" "}
            or{" "}
            <a href={links.whatsappEnquiry} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              WhatsApp
            </a>
            .
          </p>
        </div>
      )}

      <div>
        {label("name", "Full name")}
        <input {...field("name")} autoComplete="name" />
        {error("name")}
      </div>
      <div>
        {label("email", "Email address")}
        <input {...field("email")} type="email" autoComplete="email" />
        {error("email")}
      </div>
      <div>
        {label("phone", "Phone number")}
        <input {...field("phone")} type="tel" autoComplete="tel" placeholder="e.g. 024 437 0672" />
        {error("phone")}
      </div>
      <div>
        {label("company", "Company", true)}
        <input {...field("company")} autoComplete="organization" />
        {error("company")}
      </div>
      <div className="sm:col-span-2">
        {label("service", "Service of interest", true)}
        <select {...field("service")}>
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        {label("message", "How can we help?")}
        <textarea {...field("message")} rows={5} placeholder="Tell us about your property and what you need." />
        {error("message")}
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">We respond to all enquiries as quickly as possible.</p>
        <button type="submit" disabled={status === "submitting"} className={buttonClass("gold", "lg")}>
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
