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
  /** Prisma / kapak: /images/covers/... */
  imageUrl?: string | null;
};
