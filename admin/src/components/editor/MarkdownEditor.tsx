"use client";

import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Markdown } from "@/components/editor/Markdown";
import { cn } from "@/lib/format";

type Action = { label: string; icon: LucideIcon } & (
  | { kind: "wrap"; before: string; after: string; placeholder: string }
  | { kind: "line"; prefix: string }
);

const ACTIONS: Action[] = [
  { label: "Bold", icon: Bold, kind: "wrap", before: "**", after: "**", placeholder: "bold text" },
  { label: "Italic", icon: Italic, kind: "wrap", before: "_", after: "_", placeholder: "italic text" },
  { label: "Heading 2", icon: Heading2, kind: "line", prefix: "## " },
  { label: "Heading 3", icon: Heading3, kind: "line", prefix: "### " },
  { label: "Link", icon: Link2, kind: "wrap", before: "[", after: "](https://)", placeholder: "link text" },
  { label: "Bullet list", icon: List, kind: "line", prefix: "- " },
  { label: "Numbered list", icon: ListOrdered, kind: "line", prefix: "1. " },
  { label: "Quote", icon: Quote, kind: "line", prefix: "> " },
];

type MarkdownEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  placeholder?: string;
};

export function MarkdownEditor({ id, value, onChange, error, rows = 18, placeholder }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function apply(action: Action) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end);
    let next: string;
    let selection: [number, number];

    if (action.kind === "wrap") {
      const text = selected || action.placeholder;
      next = value.slice(0, start) + action.before + text + action.after + value.slice(end);
      selection = [start + action.before.length, start + action.before.length + text.length];
    } else {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end);
      const lines = block.split("\n");
      const prefixed = lines
        .map((line, index) => (action.prefix === "1. " ? `${index + 1}. ` : action.prefix) + line)
        .join("\n");
      next = value.slice(0, lineStart) + prefixed + value.slice(end);
      selection = [lineStart + prefixed.length, lineStart + prefixed.length];
    }

    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(...selection);
    });
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-white shadow-sm",
        error ? "border-red-500" : "border-neutral-300 focus-within:border-brand-gold",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
        <div role="tablist" aria-label="Editor mode" className="flex gap-1">
          {(["write", "preview"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={tab === mode}
              onClick={() => setTab(mode)}
              className={cn(
                "rounded px-3 py-1 text-sm font-medium capitalize",
                tab === mode ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200" : "text-neutral-500",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        {tab === "write" && (
          <div className="flex flex-wrap gap-0.5" role="toolbar" aria-label="Formatting">
            {ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.label}
                aria-label={action.label}
                onClick={() => apply(action)}
                className="rounded p-1.5 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              >
                <action.icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="block w-full resize-y border-0 px-4 py-3 font-mono text-sm leading-relaxed text-neutral-900 focus:outline-none focus:ring-0"
        />
      ) : (
        <div className="min-h-[300px] px-5 py-4">
          {value.trim() ? <Markdown content={value} /> : <p className="text-sm text-neutral-400">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  );
}
