import type { Post } from "@/types/post";

const WORDS_PER_MINUTE = 220;

function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>\-\[\]\(\)|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function getReadingTimeMinutes(post: Pick<Post, "excerpt" | "content">): number {
  const body = post.content?.trim() || "";
  const words = countWords(body.length > 80 ? body : post.excerpt);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} dk okuma`;
}
