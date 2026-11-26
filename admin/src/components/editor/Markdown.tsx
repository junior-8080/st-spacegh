import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders markdown with the same prose styling the public website uses. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-black prose-a:font-semibold prose-a:text-brand-black prose-a:decoration-brand-gold prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-brand-gold-ink prose-blockquote:border-l-brand-gold prose-strong:text-brand-black prose-li:marker:text-brand-gold-dark">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
