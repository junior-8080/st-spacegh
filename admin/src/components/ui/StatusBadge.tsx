import { cn } from "@/lib/format";

const styles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  draft: "bg-amber-50 text-amber-800 ring-amber-600/25",
  closed: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  expired: "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        styles[status] ?? styles.closed,
      )}
    >
      {status}
    </span>
  );
}
