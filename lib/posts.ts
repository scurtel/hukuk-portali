import type { Post } from "@/types/post";
import { staticPosts } from "@/lib/staticData";

export { getPostHref } from "@/lib/post-urls";

function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string, type?: Post["type"]): Promise<Post | undefined> {
  return staticPosts.find((post) => post.slug === slug && (!type || post.type === type));
}

export async function getPostsByType(type: Post["type"], take?: number): Promise<Post[]> {
  const posts = sortByDateDesc(staticPosts.filter((post) => post.type === type));
  return typeof take === "number" ? posts.slice(0, take) : posts;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return sortByDateDesc(staticPosts.filter((post) => post.featured));
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return sortByDateDesc(staticPosts.filter((post) => post.categorySlug === categorySlug));
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  return sortByDateDesc(staticPosts.filter((post) => post.authorSlug === authorSlug));
}

/** Sitemap ve toplu işlemler için */
export async function getAllPosts(): Promise<Post[]> {
  return sortByDateDesc(staticPosts);
}
