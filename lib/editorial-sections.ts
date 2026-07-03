import type { Post } from "@/types/post";

import {
  getAiLawyerPosts,
  getHomeAnalizPosts,
  getHotNewsPosts,
  getLatestPosts,
  getLegalTechSpotlightPosts,
  getTechLawPosts,
  isHomepageVisible
} from "@/lib/home";
import { getPostsByType, staticPosts } from "@/lib/posts";

export type EditorialSectionConfig = {
  id: string;
  title: string;
  href: string;
  getPosts: (take?: number) => Post[];
};

function scoreByKeywords(keywords: string[], take: number, fallback: () => Post[]): Post[] {
  const pool = staticPosts.filter((p) => p.isPublic !== false && isHomepageVisible(p));
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
    );

  if (scored.length >= take) return scored.slice(0, take).map((x) => x.post);
  return fallback().slice(0, take);
}

function uniqueBySlug(posts: Post[]): Post[] {
  const seen = new Set<string>();
  return posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export const EDITORIAL_HOME_SECTIONS: EditorialSectionConfig[] = [
  {
    id: "son-yazilar",
    title: "Son Yazılar",
    href: "/haberler",
    getPosts: (take = 8) => getLatestPosts(take)
  },
  {
    id: "gundem",
    title: "Gündem",
    href: "/kategori/haber",
    getPosts: (take = 6) => getHotNewsPosts(take)
  },
  {
    id: "yapay-zeka",
    title: "Yapay Zekâ",
    href: "/konu/yapay-zeka",
    getPosts: (take = 5) => {
      const ai = getAiLawyerPosts();
      const extra = scoreByKeywords(["yapay", "yz", "yapay zeka", "gemini"], take, () =>
        getPostsByType("haber", take)
      );
      return uniqueBySlug([...ai, ...extra]).slice(0, take);
    }
  },
  {
    id: "hukuk-teknolojileri",
    title: "LegalTech",
    href: "/#hukuk-teknolojileri",
    getPosts: (take = 5) => {
      const spotlight = getLegalTechSpotlightPosts();
      if (spotlight.length >= take) return spotlight.slice(0, take);
      const extra = getTechLawPosts(take).filter(
        (p) => !spotlight.some((s) => s.slug === p.slug)
      );
      return [...spotlight, ...extra].slice(0, take);
    }
  },
  {
    id: "mahkeme",
    title: "Mahkeme Kararları",
    href: "/konu/mevzuat",
    getPosts: (take = 5) =>
      scoreByKeywords(
        ["mahkeme", "yargıtay", "anayasa", "karar", "içtihat", "hmk", "temyiz"],
        take,
        () => getPostsByType("analiz", take)
      )
  },
  {
    id: "analizler",
    title: "Analizler",
    href: "/kategori/analiz",
    getPosts: (take = 5) => getHomeAnalizPosts(take)
  },
  {
    id: "rehberler",
    title: "Son Rehberler",
    href: "/kategori/rehber",
    getPosts: (take = 5) => getPostsByType("rehber", take)
  },
  {
    id: "dijital",
    title: "Dijital Dönüşüm",
    href: "/kategori/rehber",
    getPosts: (take = 5) => {
      const latest = getPostsByType("rehber", take);
      const keywordHits = scoreByKeywords(
        ["dijital", "dönüşüm", "otomasyon", "legaltech", "uyap", "e-devlet"],
        take,
        () => []
      );
      return uniqueBySlug([...latest, ...keywordHits]).slice(0, take);
    }
  }
];
