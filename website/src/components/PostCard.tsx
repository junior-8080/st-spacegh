import { ArrowRight, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatDate } from "@/lib/format";
import type { PostSummary } from "@/types";

export function PostCover({ post, sizes, priority, className }: { post: PostSummary; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-charcoal", className)}>
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt=""
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#2a2a2a_0%,#141414_45%,#0a0a0a_100%)]" />
          <div className="bg-gold-lines absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="size-10 text-brand-gold/70" strokeWidth={1.25} />
          </div>
        </div>
      )}
    </div>
  );
}

export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex h-full overflow-hidden border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl",
        featured ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      <PostCover
        post={post}
        priority={featured}
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className={featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2 lg:min-h-96" : "aspect-[16/10]"}
      />
      <div className={cn("flex flex-1 flex-col p-6", featured && "sm:p-10 lg:justify-center")}>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-brand-black px-2.5 py-1 font-heading font-bold uppercase tracking-wider text-brand-gold">{post.category}</span>
          <time dateTime={post.publishedAt} className="text-neutral-500">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h3
          className={cn(
            "mt-4 font-heading font-extrabold leading-snug text-brand-black",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className={cn("mt-3 flex-1 leading-relaxed text-neutral-600", featured ? "text-base" : "line-clamp-3 text-sm")}>
            {post.excerpt}
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-brand-black">
          Read article <ArrowRight className="size-4 text-brand-gold-dark transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
