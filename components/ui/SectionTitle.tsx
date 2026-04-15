import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">{children}</h2>;
}
