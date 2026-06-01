import type { Post } from "@/types/post";

import { AI_LAWYER_SLUGS } from "@/lib/home";
import { getMevzuatHighlightPosts } from "@/lib/home";
import { getAllPosts, getPostBySlug, getPostsByType } from "@/lib/posts";

export type TopicDefinition = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export const TOPICS: TopicDefinition[] = [
  {
    slug: "yapay-zeka",
    title: "Yapay Zekâ ve Hukuk",
    description:
      "Avukatlar ve hukuk büroları için yapay zekâ, LegalTech, dilekçe hazırlığı, mesleki sır ve KVKK başlıklarında güncel rehber ve analizler.",
    seoTitle: "Yapay Zekâ ve Hukuk | Hukuk Portalı",
    seoDescription:
      "Avukatlar için yapay zekâ hukuki çerçeve, dilekçe kontrol listesi, mesleki sır ve kişisel veri koruma içerikleri."
  },
  {
    slug: "mevzuat",
    title: "Mevzuat ve Yargı Gündemi",
    description:
      "Mevzuat değişiklikleri, yargı kararları, düzenleyici gelişmeler ve hukuk gündemine dair haber ve analizler.",
    seoTitle: "Mevzuat ve Yargı Gündemi | Hukuk Portalı",
    seoDescription:
      "Güncel mevzuat, yargı paketleri, mahkeme uygulamaları ve hukuk haberleri."
  }
];

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

const AI_EXTRA_SLUGS = [
  "yapay-zeka-avukat-sorumlulugu",
  "yapay-zeka-avukatsiz-dava-dilekcesi",
  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri"
] as const;

export function getPostsForTopic(slug: string): Post[] {
  if (slug === "yapay-zeka") {
    const slugs = [...AI_LAWYER_SLUGS, ...AI_EXTRA_SLUGS];
    const fromSlugs = slugs.map((s) => getPostBySlug(s)).filter((p): p is Post => Boolean(p));
    const keywords = ["yapay", "yz", "legaltech", "dijital"];
    const pool = getAllPosts().filter(
      (p) =>
        !fromSlugs.some((x) => x.slug === p.slug) &&
        keywords.some((k) => `${p.title} ${p.excerpt}`.toLocaleLowerCase("tr").includes(k))
    );
    return uniqueBySlug([...fromSlugs, ...pool]).slice(0, 24);
  }

  if (slug === "mevzuat") {
    const highlighted = getMevzuatHighlightPosts(12);
    const news = getPostsByType("haber").filter((p) => !highlighted.some((h) => h.slug === p.slug));
    return uniqueBySlug([...highlighted, ...news]).slice(0, 24);
  }

  return [];
}

function uniqueBySlug(posts: Post[]): Post[] {
  const seen = new Set<string>();
  return posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}
