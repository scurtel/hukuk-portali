import { getPostHref } from "@/lib/post-urls";
import { getAllPosts } from "@/lib/posts";

export type SearchIndexEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  type: string;
  categorySlug: string;
  publishedAt: string;
  href: string;
  searchText: string;
};

export function getSearchIndex(): SearchIndexEntry[] {
  return getAllPosts().map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    type: post.type,
    categorySlug: post.categorySlug,
    publishedAt: post.publishedAt,
    href: getPostHref(post),
    searchText: [post.title, post.excerpt, post.seo?.focusKeyword, ...(post.seo?.secondaryKeywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr")
  }));
}

export function searchIndex(query: string, items: SearchIndexEntry[], limit = 20): SearchIndexEntry[] {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];

  return items
    .map((item) => {
      let score = 0;
      for (const token of tokens) {
        if (item.searchText.includes(token)) score += 2;
        if (item.title.toLocaleLowerCase("tr").includes(token)) score += 3;
      }
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
