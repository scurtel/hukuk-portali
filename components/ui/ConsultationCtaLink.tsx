import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ConsultationCtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function ConsultationCtaLink({ href, className, children, ...rest }: ConsultationCtaLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md bg-brand-700 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        className
      )}
      {...rest}
    >
      {children ?? "Hukuki Danışmanlık Al"}
    </a>
  );
}
