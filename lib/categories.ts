import type { Category, CategoryType } from "@/types/category";
import { staticCategories } from "@/lib/staticData";

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
  const row = staticCategories.find((category) => category.slug === slug);
  return row ? mapRow(row) : undefined;
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = [...staticCategories].sort((a, b) => a.slug.localeCompare(b.slug, "tr"));
  return rows.map(mapRow);
}
