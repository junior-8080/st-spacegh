import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { PostCard, PostCover } from "@/components/PostCard";
import { Prose } from "@/components/Prose";
import { ShareButtons } from "@/components/ShareButtons";
import { Container, Ribbon, SectionHeading } from "@/components/ui";
import { getPost, getPosts } from "@/lib/api";
import { formatDate, readingTime } from "@/lib/format";
import { site, siteUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  const description = post.seoDescription || post.excerpt;
  return {
    title: post.seoTitle || post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: { card: "summary_large_image", title: post.seoTitle || post.title, description },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;
  const minutes = readingTime(post.content);
  const sameCategory = await getPosts({ category: post.category, limit: 4 });
  let related = sameCategory.data.filter((item) => item.slug !== post.slug);
  if (related.length < 3) {
    const latest = await getPosts({ limit: 4 });
    const extra = latest.data.filter((item) => item.slug !== post.slug && !related.some((r) => r.slug === item.slug));
    related = [...related, ...extra];
  }
  related = related.slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: site.fullName, logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo-mark.svg` } },
    mainEntityOfPage: url,
    ...(post.coverImage && { image: [post.coverImage] }),
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <article>
        <header
          className={`relative isolate overflow-hidden bg-brand-black pt-36 sm:pt-44 ${post.coverImage ? "pb-36 sm:pb-44" : "pb-14 sm:pb-16"}`}
        >
          <div aria-hidden className="bg-gold-lines absolute inset-0 -z-10" />
          <Container size="narrow">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gray hover:text-brand-gold">
              <ArrowLeft className="size-4" aria-hidden /> All articles
            </Link>
            <div className="mt-8">
              <Ribbon>{post.category}</Ribbon>
            </div>
            <h1 className="mt-5 font-heading text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-brand-gray">{post.excerpt}</p>}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-gray">
              <li className="flex items-center gap-2">
                <UserRound className="size-4 text-brand-gold" aria-hidden /> {post.author}
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="size-4 text-brand-gold" aria-hidden />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-brand-gold" aria-hidden /> {minutes} min read
              </li>
            </ul>
          </Container>
        </header>

        <div className="bg-white">
          {post.coverImage && (
            <Container size="narrow" className="relative -mt-24 sm:-mt-32">
              <PostCover post={post} priority sizes="(min-width: 896px) 896px, 100vw" className="clip-angle aspect-[16/8] w-full shadow-2xl" />
            </Container>
          )}
          <Container size="prose" className="py-14 sm:py-20">
            <Prose content={post.content} />
            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-brand-offwhite px-3 py-1 text-xs font-semibold text-neutral-700">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-col gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-600">
                Written by <strong className="text-brand-black">{post.author}</strong>
              </p>
              <ShareButtons url={url} title={post.title} />
            </div>
          </Container>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-brand-offwhite py-20 sm:py-24">
          <Container>
            <SectionHeading ribbon="Keep reading" title="Related articles" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTASection />
      <JsonLd data={articleSchema} />
    </>
  );
}
