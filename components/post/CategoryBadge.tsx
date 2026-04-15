import Link from "next/link";

type CategoryBadgeProps = {
  slug: string;
};

export function CategoryBadge({ slug }: CategoryBadgeProps) {
  return (
    <Link href={`/kategori/${slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
      {slug.toUpperCase()}
    </Link>
  );
}
