import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import { Container, Gold } from "@/components/ui";
import { getPosts } from "@/lib/api";
import { cn } from "@/lib/format";
import { POST_CATEGORIES, type PostCategory } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Facilities management tips, maintenance guides, hygiene advice and company news from ST-SPACE in Accra and Kumasi.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 9;

function blogHref(category: PostCategory | undefined, page = 1): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const query = await searchParams;
  const category = POST_CATEGORIES.find((c) => c === query.category);
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const { data: posts, totalPages } = await getPosts({ category, page, limit: PAGE_SIZE });

  const featured = page === 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <>
      <PageHero
        ribbon="Blog & insights"
        title={
          <>
            Insights for <Gold>smarter spaces</Gold>
          </>
        }
        description="Practical guidance on maintenance, hygiene, safety and property management from the ST-SPACE team."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Blog" }]}
      />

      <section className="bg-brand-offwhite py-16 sm:py-24">
        <Container>
          <nav aria-label="Blog categories">
            <ul className="flex flex-wrap gap-2">
              {[undefined, ...POST_CATEGORIES].map((item) => {
                const active = item === category;
                return (
                  <li key={item ?? "all"}>
                    <Link
                      href={blogHref(item)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center rounded-full border px-5 text-sm font-semibold transition",
                        active
                          ? "border-brand-black bg-brand-black text-brand-gold"
                          : "border-neutral-300 bg-white text-brand-black hover:border-brand-gold",
                      )}
                    >
                      {item ?? "All articles"}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {posts.length === 0 ? (
            <div className="mt-12 border border-neutral-200 bg-white px-6 py-16 text-center">
              <Newspaper className="mx-auto size-12 text-brand-gold-dark" strokeWidth={1.25} aria-hidden />
              <h2 className="mt-5 font-heading text-xl font-extrabold uppercase text-brand-black">No articles yet</h2>
              <p className="mt-2 text-neutral-600">
                {category ? "There are no articles in this category yet." : "New articles are on the way. Check back soon."}
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mt-12">
                  <PostCard post={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={blogHref(category, page - 1)}
                  className="inline-flex h-11 items-center gap-1 border border-neutral-300 bg-white px-4 text-sm font-semibold text-brand-black hover:border-brand-gold"
                >
                  <ChevronLeft className="size-4" aria-hidden /> Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <Link
                  key={number}
                  href={blogHref(category, number)}
                  aria-current={number === page ? "page" : undefined}
                  aria-label={`Page ${number}`}
                  className={cn(
                    "inline-flex size-11 items-center justify-center border text-sm font-bold",
                    number === page
                      ? "border-brand-black bg-brand-black text-brand-gold"
                      : "border-neutral-300 bg-white text-brand-black hover:border-brand-gold",
                  )}
                >
                  {number}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={blogHref(category, page + 1)}
                  className="inline-flex h-11 items-center gap-1 border border-neutral-300 bg-white px-4 text-sm font-semibold text-brand-black hover:border-brand-gold"
                >
                  Next <ChevronRight className="size-4" aria-hidden />
                </Link>
              )}
            </nav>
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
