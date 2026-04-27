export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_CARD_EXCERPT_MAX = 200;

/** Liste / kart görünümlerinde özet uzunluğunu sınırlar; tam metin `title` ile verilebilir. */
export function truncatePostCardExcerpt(text: string, maxLength: number = DEFAULT_CARD_EXCERPT_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}
