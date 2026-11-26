"use client";

import { cn } from "@/lib/format";

type FilterTabsProps<T extends string> = {
  tabs: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function FilterTabs<T extends string>({ tabs, value, onChange, label }: FilterTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition",
            value === tab.value ? "bg-brand-black text-white" : "text-neutral-600 hover:text-neutral-900",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
