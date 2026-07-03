import type { Post } from "@/types/post";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80"
] as const;

export function getPostDisplayImage(post: Post): string {
  if (post.imageUrl && post.imageUrl.length > 0) return post.imageUrl;
  const imageIndex =
    post.id
      .toString()
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[imageIndex];
}

export function formatPostDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function formatShortPostDate(publishedAt: string): string {
  const date = new Date(publishedAt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
