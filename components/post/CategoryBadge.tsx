import Link from "next/link";

import { getCategoryBySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

export function CategoryBadge({ slug, className, size = "sm" }: CategoryBadgeProps) {
  const category = getCategoryBySlug(slug);
  const label = category?.name ?? slug;

  return (
    <Link
      href={`/kategori/${slug}`}
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wider text-gold transition active:text-gold-light",
        size === "sm" ? "text-[10px] tracking-[0.12em]" : "text-xs",
        className
      )}
    >
      {label}
    </Link>
  );
}
