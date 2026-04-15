import type { Category } from "@/types/category";

export const categories: Category[] = [
  {
    id: "c1",
    slug: "haber",
    name: "Haber",
    description: "Güncel hukuk gündemi, düzenlemeler ve kararlar.",
    type: "haber"
  },
  {
    id: "c2",
    slug: "rehber",
    name: "Rehber",
    description: "Hukuki süreçleri adım adım anlatan içerikler.",
    type: "rehber"
  },
  {
    id: "c3",
    slug: "analiz",
    name: "Analiz",
    description: "Karar ve mevzuat değerlendirmeleri.",
    type: "analiz"
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
