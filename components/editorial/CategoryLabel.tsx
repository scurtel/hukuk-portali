import Link from "next/link";

import { getCategoryBySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryLabelProps = {
  slug: string;
  className?: string;
  linked?: boolean;
};

export function CategoryLabel({ slug, className, linked = true }: CategoryLabelProps) {
  const category = getCategoryBySlug(slug);
  const label = category?.name ?? slug;

  const styles = cn(
    "inline-flex items-center text-[10px] font-bold uppercase tracking-[0.14em] text-gold sm:text-[11px]",
    className
  );

  if (!linked) {
    return <span className={styles}>{label}</span>;
  }

  return (
    <Link href={`/kategori/${slug}`} className={cn(styles, "transition hover:text-gold-light")}>
      {label}
    </Link>
  );
}
