import type { Post } from "@/types/post";
import { prisma } from "@/lib/prisma";

export { getPostHref } from "@/lib/post-urls";

const postInclude = { author: true, category: true } as const;
type Row = Awaited<ReturnType<typeof prisma.post.findFirst<{ include: typeof postInclude }>>>;

function mapRow(row: NonNullable<Row>): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    type: row.type as Post["type"],
    categorySlug: row.category.slug,
    authorSlug: row.author.slug,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    featured: row.featured,
    imageUrl: row.imageUrl ?? undefined
  };
}

export async function getPostBySlug(slug: string, type?: Post["type"]): Promise<Post | undefined> {
  const row = await prisma.post.findFirst({
    where: {
      slug,
      ...(type ? { type } : {})
    },
    include: postInclude
  });
  return row ? mapRow(row) : undefined;
}

export async function getPostsByType(type: Post["type"], take?: number): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { type },
    orderBy: { publishedAt: "desc" },
    take: take ?? undefined,
    include: postInclude
  });
  return rows.map(mapRow);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { featured: true },
    orderBy: { publishedAt: "desc" },
    include: postInclude
  });
  return rows.map(mapRow);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    include: postInclude
  });
  return rows.map(mapRow);
}

export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    where: { author: { slug: authorSlug } },
    orderBy: { publishedAt: "desc" },
    include: postInclude
  });
  return rows.map(mapRow);
}

/** Sitemap ve toplu işlemler için */
export async function getAllPosts(): Promise<Post[]> {
  const rows = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
    include: postInclude
  });
  return rows.map(mapRow);
}
