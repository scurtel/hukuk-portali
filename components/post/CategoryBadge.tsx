import Link from "next/link";

import { getCategoryBySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  slug: string;
  className?: string;
  size?: "sm" | "md";
};

const variantBySlug: Record<string, string> = {
  haber: "bg-accent-red text-white hover:bg-accent-red-dark",
  analiz: "bg-brand-900 text-white hover:bg-brand-700",
  rehber: "bg-brand-500 text-white hover:bg-brand-700"
};

export function CategoryBadge({ slug, className, size = "sm" }: CategoryBadgeProps) {
  const category = getCategoryBySlug(slug);
  const label = category?.name ?? slug;
  const variant = variantBySlug[slug] ?? "bg-slate-700 text-white hover:bg-slate-800";

  return (
    <Link
      href={`/kategori/${slug}`}
      className={cn(
        "inline-flex items-center font-semibold uppercase tracking-wide transition",
        size === "sm" ? "min-h-7 px-2 py-0.5 text-[10px] sm:text-xs" : "min-h-8 px-2.5 py-1 text-xs",
        variant,
        className
      )}
    >
      {label}
    </Link>
  );
}
