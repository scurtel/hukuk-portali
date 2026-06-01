import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = {
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  className?: string;
  id?: string;
};

export function SectionTitle({ children, href, linkLabel = "Tümünü gör", className, id }: SectionTitleProps) {
  return (
    <div
      id={id}
      className={cn("mb-5 flex scroll-mt-28 items-end justify-between gap-4 border-b-2 border-brand-900 pb-2", className)}
    >
      <h2 className="font-serif text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">{children}</h2>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-500 transition hover:text-accent-red sm:text-sm"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
