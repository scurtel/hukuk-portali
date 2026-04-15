import Link from "next/link";

type CategoryBadgeProps = {
  slug: string;
};

export function CategoryBadge({ slug }: CategoryBadgeProps) {
  return (
    <Link
      href={`/kategori/${slug}`}
      className="inline-flex min-h-9 items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
    >
      {slug.toUpperCase()}
    </Link>
  );
}
