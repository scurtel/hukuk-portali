import Link from "next/link";

type EditorialSectionHeaderProps = {
  title: string;
  href: string;
};

export function EditorialSectionHeader({ title, href }: EditorialSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-navy/15 py-2">
      <h2 className="font-editorial text-sm font-bold uppercase tracking-wide text-navy sm:text-base">{title}</h2>
      <Link
        href={href}
        className="shrink-0 text-xs font-bold uppercase tracking-wider text-gold transition active:text-gold-light"
        aria-label={`${title} — tümü`}
      >
        →
      </Link>
    </div>
  );
}
