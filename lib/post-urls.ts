import type { Post } from "@/types/post";

/** Sitede kullanılan URL (analizler rotası); istemci bileşenlerinde güvenle kullanılabilir. */
export function getPostHref(post: Pick<Post, "type" | "slug">): string {
  return post.type === "analiz" ? `/analizler/${post.slug}` : `/${post.type}/${post.slug}`;
}
