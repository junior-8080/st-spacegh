import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/format";

/** Brand-styled markdown: dark headings, gold-accented links, quotes and bullets. */
export function Prose({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-brand-black prose-p:text-neutral-700 prose-a:font-semibold prose-a:text-brand-black prose-a:decoration-brand-gold prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-brand-gold-ink prose-strong:text-brand-black prose-blockquote:border-l-brand-gold prose-blockquote:text-neutral-700 prose-li:text-neutral-700 prose-li:marker:text-brand-gold-dark prose-img:rounded-none",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
