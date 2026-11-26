"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type TagInputProps = { id: string; value: string[]; onChange: (tags: string[]) => void };

/** Comma or Enter adds a tag; Backspace on an empty input removes the last one. */
export function TagInput({ id, value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const additions = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !value.some((existing) => existing.toLowerCase() === tag.toLowerCase()));
    if (additions.length) onChange([...value, ...additions]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2 py-1.5 shadow-sm focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/30">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-black px-2.5 py-0.5 text-xs font-medium text-white">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={`Remove tag ${tag}`}
            className="text-brand-gray hover:text-brand-gold"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => (event.target.value.includes(",") ? commit(event.target.value) : setDraft(event.target.value))}
        onKeyDown={onKeyDown}
        onBlur={() => draft && commit(draft)}
        placeholder={value.length ? "" : "e.g. maintenance, hvac"}
        className="min-w-24 flex-1 border-0 bg-transparent p-1 text-sm focus:outline-none"
      />
    </div>
  );
}
