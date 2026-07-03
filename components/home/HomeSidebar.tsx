import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { getAllCategories } from "@/lib/categories";
import { getLatestPosts, getMevzuatHighlightPosts } from "@/lib/home";
import { formatPostDate } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { getPostsByType } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export function HomeSidebar() {
  const trending = getLatestPosts(6);
  const mevzuat = getMevzuatHighlightPosts(5);
  const categories = getAllCategories();
  const latestAnalysis = getPostsByType("analiz", 4);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="border border-slate-200 bg-white p-4 shadow-editorial">
        <h2 className="border-b border-navy/15 pb-2 font-editorial text-base font-bold uppercase tracking-wide text-navy">
          Son Yazılar
        </h2>
        <ul className="mt-3 space-y-3">
          {trending.map((post, i) => (
            <li key={post.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-navy text-xs font-bold text-gold">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Link
                  href={getPostHref(post)}
                  className="line-clamp-3 text-sm font-semibold leading-snug text-navy transition hover:text-gold"
                >
                  {post.title}
                </Link>
                <time dateTime={post.publishedAt} className="mt-1 block text-[11px] text-ink-subtle">
                  {formatPostDate(post.publishedAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div id="mevzuat" className="scroll-mt-28 border border-slate-200 bg-white p-4 shadow-editorial">
        <h2 className="border-b border-gold/40 pb-2 font-editorial text-base font-bold uppercase tracking-wide text-navy">
          Mevzuat
        </h2>
        <ul className="mt-3 space-y-3">
          {mevzuat.map((post) => (
            <li key={post.id}>
              <CategoryBadge slug={post.categorySlug} />
              <Link
                href={getPostHref(post)}
                className="mt-1 block text-sm font-semibold leading-snug text-navy transition hover:text-gold"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/konu/mevzuat" className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-gold hover:text-gold-light">
          Tümü →
        </Link>
      </div>

      <div className="border border-slate-200 bg-navy p-4 text-white shadow-editorial">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Yayın</p>
        <p className="mt-2 font-editorial text-lg font-bold leading-snug">{siteConfig.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{siteConfig.description}</p>
        <Link
          href="/hakkimizda"
          className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-gold transition hover:text-gold-light"
        >
          Hakkımızda →
        </Link>
      </div>

      <div className="border border-slate-200 bg-white p-4 shadow-editorial">
        <h2 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-ink-subtle">
          Kategoriler
        </h2>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="text-sm font-medium text-navy transition hover:text-gold"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ink-subtle">Son Analizler</h2>
        <ul className="mt-3 space-y-2">
          {latestAnalysis.map((post) => (
            <li key={post.id}>
              <Link href={getPostHref(post)} className="text-sm font-medium text-navy transition hover:text-gold">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
