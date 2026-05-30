import type { Author } from "@/types/author";
import { staticAuthors } from "@/lib/posts";
import { PRIMARY_AUTHOR_SLUG } from "@/lib/seo/cerenLawyer";

function toAuthor(author: Author): Author {
  return {
    id: author.id,
    slug: author.slug,
    name: author.name,
    title: author.title,
    bio: author.bio,
    avatar: author.avatar
  };
}

/** Dahili authorSlug çözümlemesi; arayüzde kişisel yazar gösterilmez. */
export function getAuthorBySlug(slug: string): Author | undefined {
  const author = staticAuthors.find((item) => item.slug === slug);
  return author ? toAuthor(author) : undefined;
}

export function getAuthorsBySlugs(slugs: string[]): Map<string, Author> {
  const unique = [...new Set(slugs)];
  const matchedAuthors = staticAuthors.filter((author) => unique.includes(author.slug));
  const map = new Map<string, Author>();
  for (const author of matchedAuthors) {
    map.set(author.slug, toAuthor(author));
  }
  return map;
}

export function getAllAuthors(): Author[] {
  return [...staticAuthors].sort((a, b) => a.name.localeCompare(b.name, "tr")).map(toAuthor);
}

export { PRIMARY_AUTHOR_SLUG };
