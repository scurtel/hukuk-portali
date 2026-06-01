import Link from "next/link";

import { EditorialCard } from "@/components/editorial/EditorialCard";
import { EditorialSectionBlock } from "@/components/editorial/EditorialSectionBlock";
import { EDITORIAL_HOME_SECTIONS } from "@/lib/editorial-sections";
import { getHotNewsPosts } from "@/lib/home";
import { getPostHref } from "@/lib/post-urls";
import { getFeaturedPosts, getPostsByType } from "@/lib/posts";

function getLeadStory() {
  const featured = getFeaturedPosts();
  const news = getPostsByType("haber");
  return featured[0] ?? news[0];
}

export function MobileEditorialHome() {
  const lead = getLeadStory();
  const secondary = getHotNewsPosts(8).filter((p) => p.slug !== lead?.slug).slice(0, 5);

  return (
    <div className="bg-white">
      {lead ? (
        <section className="border-b border-slate-200" aria-label="Manşet">
          <EditorialCard post={lead} variant="featured" priorityImage />
          {secondary.length > 0 ? (
            <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Gündem</p>
              <div className="divide-y divide-slate-200/90">
                {secondary.slice(0, 4).map((post) => (
                  <EditorialCard key={post.id} post={post} variant="row" headingLevel="h3" />
                ))}
              </div>
              <Link
                href="/kategori/haber"
                className="mt-3 flex min-h-11 items-center justify-center rounded-sm border border-navy/15 bg-white text-sm font-bold uppercase tracking-wide text-navy transition active:border-gold active:text-gold"
              >
                Tüm gündem haberleri
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="border-b border-navy/10 bg-navy px-4 py-2.5" aria-label="Son dakika">
        <div className="mx-auto flex max-w-portal items-center gap-2">
          <span className="shrink-0 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-navy">
            Canlı
          </span>
          <div className="flex min-w-0 flex-1 gap-4 overflow-x-auto whitespace-nowrap text-xs font-medium text-white/90 scrollbar-none">
            {getHotNewsPosts(6).map((post) => (
              <Link key={post.id} href={getPostHref(post)} className="transition active:text-gold">
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {EDITORIAL_HOME_SECTIONS.map((section) => {
        const posts = section.getPosts(section.id === "gundem" ? 4 : 5);
        const skipSlugs = new Set([lead?.slug, ...secondary.map((p) => p.slug)]);
        const filtered = posts.filter((p) => !skipSlugs.has(p.slug));
        if (section.id === "gundem") return null;
        return (
          <EditorialSectionBlock
            key={section.id}
            section={section}
            posts={filtered}
            scrollOnMobile={section.id !== "analizler"}
          />
        );
      })}
    </div>
  );
}
