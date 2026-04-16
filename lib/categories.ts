import type { Category, CategoryType } from "@/types/category";
import { prisma } from "@/lib/prisma";

function mapRow(row: {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
}): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    type: row.type as CategoryType
  };
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const row = await prisma.category.findUnique({ where: { slug } });
  return row ? mapRow(row) : undefined;
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { slug: "asc" } });
  return rows.map(mapRow);
}
