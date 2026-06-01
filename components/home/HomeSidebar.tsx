import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { getAllCategories } from "@/lib/categories";
import { getHotNewsPosts, getMevzuatHighlightPosts } from "@/lib/home";
import { formatPostDate } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { getPostsByType } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export function HomeSidebar() {
  const trending = getHotNewsPosts(6);
  const mevzuat = getMevzuatHighlightPosts(5);
  const categories = getAllCategories();
  const latestAnalysis = getPostsByType("analiz", 4);

  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="border-b-2 border-brand-900 pb-2 font-serif text-lg font-bold text-brand-900">Öne Çıkanlar</h2>
        <ul className="mt-3 space-y-3">
          {trending.map((post, i) => (
            <li key={post.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand-900 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Link href={getPostHref(post)} className="line-clamp-3 text-sm font-semibold leading-snug text-ink hover:text-brand-500">
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

      <div id="mevzuat" className="scroll-mt-28 rounded-sm border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="border-b-2 border-accent-red pb-2 font-serif text-lg font-bold text-brand-900">Mevzuat &amp; Gündem</h2>
        <ul className="mt-3 space-y-3">
          {mevzuat.map((post) => (
            <li key={post.id}>
              <CategoryBadge slug={post.categorySlug} />
              <Link
                href={getPostHref(post)}
                className="mt-1 block text-sm font-semibold leading-snug text-ink hover:text-brand-500"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/konu/mevzuat" className="mt-4 inline-block text-xs font-bold uppercase text-brand-500 hover:text-accent-red">
          Mevzuat hub →
        </Link>
      </div>

      <div className="rounded-sm border border-slate-200 bg-brand-900 p-4 text-white shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">Platform</p>
        <p className="mt-2 font-serif text-lg font-bold leading-snug">{siteConfig.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/85">{siteConfig.description}</p>
        <Link
          href="/hakkimizda"
          className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          Hakkımızda
        </Link>
      </div>

      <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-ink-muted">Kategoriler</h2>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="text-sm font-medium text-ink transition hover:text-brand-500"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Son Analizler</h2>
        <ul className="mt-3 space-y-2">
          {latestAnalysis.map((post) => (
            <li key={post.id}>
              <Link href={getPostHref(post)} className="text-sm font-medium text-ink hover:text-brand-500">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
