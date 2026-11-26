"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { inputClass } from "@/components/ui/Field";

export type ListItem = { id: string; value: string };

let counter = 0;
export function toListItems(values: string[]): ListItem[] {
  return values.map((value) => ({ id: `item-${++counter}`, value }));
}

type ListInputProps = {
  id: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder?: string;
  addLabel?: string;
};

/** Dynamic list of text rows with add, remove and reorder controls. */
export function ListInput({ id, items, onChange, placeholder, addLabel = "Add item" }: ListInputProps) {
  function update(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, value } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-2" id={id}>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="w-6 shrink-0 text-right text-xs font-semibold text-neutral-400">{index + 1}.</span>
          <input
            className={inputClass}
            value={item.value}
            placeholder={placeholder}
            aria-label={`${addLabel.replace(/^Add /, "")} ${index + 1}`}
            onChange={(event) => update(index, event.target.value)}
          />
          <div className="flex shrink-0">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label="Move up"
              className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label="Move down"
              className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
            >
              <ArrowDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove"
              className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ...toListItems([""])])}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-brand-gold-ink hover:bg-amber-50"
      >
        <Plus className="size-4" aria-hidden /> {addLabel}
      </button>
    </div>
  );
}
