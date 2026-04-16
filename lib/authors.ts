import type { Author } from "@/types/author";
import { prisma } from "@/lib/prisma";
import { CEREN_OFFICIAL_SITE, PRIMARY_AUTHOR_SLUG } from "@/lib/seo/cerenLawyer";

type AuthorRow = NonNullable<Awaited<ReturnType<typeof prisma.author.findUnique>>>;

function toAuthor(row: AuthorRow): Author {
  const base: Author = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    bio: row.bio,
    avatar: row.avatar ?? "/images/placeholder-author.jpg"
  };
  if (row.slug === PRIMARY_AUTHOR_SLUG) {
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

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const row = await prisma.author.findUnique({ where: { slug } });
  return row ? toAuthor(row) : undefined;
}

/** Post listelerinde N+1 sorguyu önlemek için */
export async function getAuthorsBySlugs(slugs: string[]): Promise<Map<string, Author>> {
  if (slugs.length === 0) return new Map();
  const unique = [...new Set(slugs)];
  const rows = await prisma.author.findMany({ where: { slug: { in: unique } } });
  const map = new Map<string, Author>();
  for (const row of rows) {
    map.set(row.slug, toAuthor(row));
  }
  return map;
}

export async function getAllAuthors(): Promise<Author[]> {
  const rows = await prisma.author.findMany({ orderBy: { name: "asc" } });
  return rows.map(toAuthor);
}
