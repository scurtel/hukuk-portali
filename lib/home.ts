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

/** Ana sayfada öne çıkarılacak güncel hukuk haberleri (sırayla) */
export const HOME_BREAKING_NEWS_SLUGS = [
  "yks-turkiye-paraguay-maci-dev-ekran-yasagi",
  "uludag-sozluk-yapay-zeka-moderator"
] as const;

/** En güncel 3'lü Gemini paketi */
export const HOME_LATEST_BATCH_SLUGS = [
  "yapay-zeka-avukatlarin-is-akisini-nasil-degistiriyor",
  "hukuk-burolarinda-yapay-zeka-kullaniminda-riskler",
  "turkiyede-hukuk-teknolojileri-yeni-donem"
] as const;

/** Ana sayfada öne çıkarılan güncel LegalTech / yapay zekâ paketi */
export const HOME_LEGALTECH_SPOTLIGHT_SLUGS = [
  ...HOME_LATEST_BATCH_SLUGS,
  "avukatlar-icin-yapay-zeka-kullanim-rehberi",
  "yapay-zeka-ile-dilekce-yazmak-guvenli-mi",
  "kvkk-yapay-zeka-muvekkil-verisi-riski",
  "hukuk-burolarinda-yapay-zeka-politikasi",
  "yapay-zeka-hukuki-arastirma-halusinasyon-riski"
] as const;

/** Ana sayfa “Avukatlar İçin Yapay Zekâ” alanı — önce güncel paket, sonra hub içerikler */
export const AI_LAWYER_SLUGS = [
  ...HOME_LEGALTECH_SPOTLIGHT_SLUGS,
  "avukatlar-icin-yapay-zeka-hukuk-rehberi",
  "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri"
] as const;

export const AI_LAWYER_CARDS: ReadonlyArray<{ slug: (typeof AI_LAWYER_SLUGS)[number]; label: string }> = [
  { slug: "avukatlar-icin-yapay-zeka-kullanim-rehberi", label: "Kullanım rehberi" },
  { slug: "yapay-zeka-ile-dilekce-yazmak-guvenli-mi", label: "Dilekçe riskleri" },
  { slug: "kvkk-yapay-zeka-muvekkil-verisi-riski", label: "KVKK ve veri" },
  { slug: "hukuk-burolarinda-yapay-zeka-politikasi", label: "Büro politikası" },
  { slug: "yapay-zeka-hukuki-arastirma-halusinasyon-riski", label: "Araştırma riski" },
  { slug: "avukatlar-icin-yapay-zeka-hukuk-rehberi", label: "Hukuki çerçeve" }
];

export function getLegalTechSpotlightPosts(): Post[] {
  return HOME_LEGALTECH_SPOTLIGHT_SLUGS.map((slug) => getPostBySlug(slug)).filter((p): p is Post =>
    Boolean(p)
  );
}

export function getBreakingNewsPosts(): Post[] {
  return HOME_BREAKING_NEWS_SLUGS.map((slug) => getPostBySlug(slug, "haber")).filter((p): p is Post =>
    Boolean(p)
  );
}

/** Ana sayfa hero: önce güncel haber, yoksa LegalTech spotlight */
export function getHomeLeadPost(): Post | undefined {
  const breaking = filterHomepagePosts(getBreakingNewsPosts())[0];
  if (breaking) return breaking;
  const spotlight = getLegalTechSpotlightPosts()[0];
  if (spotlight) return spotlight;
  return filterHomepagePosts(getFeaturedPosts())[0] ?? getPostsByType("haber")[0];
}

export function getAiLawyerPosts(): Post[] {
  return AI_LAWYER_SLUGS.map((slug) => getPostBySlug(slug)).filter((p): p is Post => Boolean(p));
}

export function getHomeAnalizPosts(take = 6): Post[] {
  const spotlight = getLegalTechSpotlightPosts().filter((p) => p.type === "analiz");
  const spotlightSlugs = new Set(spotlight.map((p) => p.slug));
  const rest = getPostsByType("analiz").filter((p) => !spotlightSlugs.has(p.slug));
  return filterHomepagePosts([...spotlight, ...rest]).slice(0, take);
}

export function getHotNewsPosts(take = 8): Post[] {
  const pinned = filterHomepagePosts(getBreakingNewsPosts());
  const pinnedSlugs = new Set(pinned.map((p) => p.slug));
  const rest = filterHomepagePosts(getPostsByType("haber")).filter((p) => !pinnedSlugs.has(p.slug));
  return [...pinned, ...rest].slice(0, take);
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
  const pinned = filterHomepagePosts(getLegalTechSpotlightPosts());
  const pinnedSlugs = new Set(pinned.map((p) => p.slug));
  const keywords = ["yapay", "dijital", "teknoloji", "legaltech", "otomasyon", "yz"];
  const pool = staticPosts.filter(
    (p) => p.isPublic !== false && isHomepageVisible(p) && !pinnedSlugs.has(p.slug)
  );
  const scored = pool
    .map((post) => {
      const bag = `${post.title} ${post.excerpt}`.toLocaleLowerCase("tr");
      const score = keywords.reduce((s, k) => (bag.includes(k) ? s + 1 : s), 0);
      return { post, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
    )
    .map((x) => x.post);

  const merged = [...pinned, ...scored];
  if (merged.length >= take) return merged.slice(0, take);
  const fallback = getPostsByType("rehber").filter((p) => !pinnedSlugs.has(p.slug));
  return [...merged, ...fallback].slice(0, take);
}
