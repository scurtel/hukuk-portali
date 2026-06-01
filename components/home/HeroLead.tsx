import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { CategoryBadge } from "@/components/post/CategoryBadge";
import { PostCard } from "@/components/post/PostCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { getFeaturedPosts, getPostsByType } from "@/lib/posts";
import { truncatePostCardExcerpt } from "@/lib/utils";

export function HeroLead() {
  const featured = getFeaturedPosts();
  const news = getPostsByType("haber");
  const lead = featured[0] ?? news[0];
  if (!lead) return null;

  const leadHref = getPostHref(lead);
  const leadImage = getPostDisplayImage(lead);
  const sidePool = [...featured.slice(1), ...news.filter((p) => p.slug !== lead.slug)];
  const sidePosts = sidePool.slice(0, 4);

  return (
    <section className="border-b border-slate-200 bg-white py-6 sm:py-8" aria-labelledby="manset-baslik">
      <Container wide>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <article className="group lg:col-span-8">
            <Link href={leadHref} className="relative block aspect-[16/9] overflow-hidden bg-slate-900 lg:aspect-[2/1]">
              <SafeImage
                src={leadImage}
                alt={lead.imageAlt ?? lead.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                fallbackSrc="/images/placeholder-post.jpg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <CategoryBadge slug={lead.categorySlug} size="md" />
                <h1 id="manset-baslik" className="news-headline mt-3 text-white">
                  {lead.title}
                </h1>
                <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                  {truncatePostCardExcerpt(lead.excerpt, 220)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="inline-flex min-h-11 items-center rounded-sm bg-accent-red px-5 text-sm font-bold uppercase tracking-wide text-white transition group-hover:bg-accent-red-dark">
                    Devamını Oku
                  </span>
                  <time dateTime={lead.publishedAt} className="text-sm text-white/80">
                    {formatPostDate(lead.publishedAt)}
                  </time>
                </div>
              </div>
            </Link>
          </article>

          <aside className="lg:col-span-4 lg:border-l lg:border-slate-200 lg:pl-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent-red">Gündem</p>
            {sidePosts.map((post) => (
              <PostCard key={post.id} post={post} variant="featured-side" headingLevel="h3" />
            ))}
          </aside>
        </div>
      </Container>
    </section>
  );
}
