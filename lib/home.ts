import type { Post } from "@/types/post";

import { getPostBySlug, getFeaturedPosts, getPostsByType, staticPosts } from "@/lib/posts";

/** Ana sayfada gösterilmeyecek; doğrudan URL ile erişilebilir kalır */
export const HOME_EXCLUDED_SLUGS = new Set<string>(["yapay-zeka-avukatsiz-dava-dilekcesi"]);

export function isHomepageVisible(post: Pick<Post, "slug">): boolean {
  return !HOME_EXCLUDED_SLUGS.has(post.slug);
}

export function filterHomepagePosts<T extends Pick<Post, "slug">>(posts: T[]): T[] {
  return posts.filter(isHomepageVisible);
}

/** Ana sayfa “Avukatlar İçin Yapay Zekâ” alanı */
export const AI_LAWYER_SLUGS = [
  "avukatlar-icin-yapay-zeka-hukuk-rehberi",
  "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri"
] as const;

export const AI_LAWYER_CARDS: ReadonlyArray<{ slug: (typeof AI_LAWYER_SLUGS)[number]; label: string }> = [
  { slug: "avukatlar-icin-yapay-zeka-hukuk-rehberi", label: "Hukuki çerçeve" },
  { slug: "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi", label: "Dilekçe hazırlama" },
  { slug: "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri", label: "Mesleki sır ve KVKK" }
];

export function getAiLawyerPosts(): Post[] {
  return AI_LAWYER_SLUGS.map((slug) => getPostBySlug(slug)).filter((p): p is Post => Boolean(p));
}

export function getHotNewsPosts(take = 8): Post[] {
  return filterHomepagePosts(getPostsByType("haber")).slice(0, take);
}

export function getHomeFeaturedPosts(): Post[] {
  return filterHomepagePosts(getFeaturedPosts());
}

export function getMevzuatHighlightPosts(take = 4): Post[] {
  const keywords = ["mevzuat", "kanun", "yargı", "mahkeme", "paket", "tbb", "kvkk", "tapu"];
  const pool = staticPosts.filter((p) => p.isPublic !== false && isHomepageVisible(p));
  const scored = pool
    .map((post) => {
      const bag = `${post.title} ${post.excerpt}`.toLocaleLowerCase("tr");
      const score = keywords.reduce((s, k) => (bag.includes(k) ? s + 1 : s), 0);
      return { post, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime());

  if (scored.length >= take) return scored.slice(0, take).map((x) => x.post);
  return getHotNewsPosts(take);
}

export function getTechLawPosts(take = 4): Post[] {
  const keywords = ["yapay", "dijital", "teknoloji", "legaltech", "otomasyon", "yz"];
  const pool = staticPosts.filter((p) => p.isPublic !== false && isHomepageVisible(p));
  const scored = pool
    .map((post) => {
      const bag = `${post.title} ${post.excerpt}`.toLocaleLowerCase("tr");
      const score = keywords.reduce((s, k) => (bag.includes(k) ? s + 1 : s), 0);
      return { post, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime());

  if (scored.length >= take) return scored.slice(0, take).map((x) => x.post);
  return getPostsByType("rehber", take);
}
