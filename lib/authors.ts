import type { Author } from "@/types/author";
import { staticAuthors } from "@/lib/posts";
import { CEREN_OFFICIAL_SITE, PRIMARY_AUTHOR_SLUG } from "@/lib/seo/cerenLawyer";

function toAuthor(author: Author): Author {
  const base: Author = {
    id: author.id,
    slug: author.slug,
    name: author.name,
    title: author.title,
    bio: author.bio,
    avatar: author.avatar ?? "/images/placeholder-author.jpg"
  };
  if (author.slug === PRIMARY_AUTHOR_SLUG) {
    return {
      ...base,
      officialWebsite: CEREN_OFFICIAL_SITE,
      expertise: [
        "Anlaşmalı / çekişmeli boşanma",
        "Mal paylaşımı",
        "İzale-i şuyu",
        "Gayrimenkul hukuku",
        "Miras hukuku"
      ]
    };
  }
  return base;
}

export function getAuthorBySlug(slug: string): Author | undefined {
  const author = staticAuthors.find((item) => item.slug === slug);
  return author ? toAuthor(author) : undefined;
}

/** Post listelerinde N+1 sorguyu önlemek için */
export function getAuthorsBySlugs(slugs: string[]): Map<string, Author> {
  if (slugs.length === 0) return new Map();
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
