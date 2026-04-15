import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-4 text-2xl font-semibold text-slate-900">{children}</h2>;
}
