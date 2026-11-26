import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "dark";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gold-gradient text-brand-black shadow-sm hover:brightness-105 active:brightness-95",
  secondary: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-neutral-700 hover:bg-neutral-100",
  dark: "bg-brand-black text-white hover:bg-brand-graphite",
};

export function buttonClass(variant: ButtonVariant = "primary", size: "sm" | "md" = "md"): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
    variants[variant],
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
};

export function Button({ variant, size, loading, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClass(variant, size), className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
