import type { CategoryType } from "./category";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: CategoryType;
  categorySlug: string;
  authorSlug: string;
  publishedAt: string;
  featured?: boolean;
  /** Kapak görseli yolu: /images/covers/... */
  imageUrl?: string | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    secondaryKeywords?: readonly string[];
  };
  faq?: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
};
