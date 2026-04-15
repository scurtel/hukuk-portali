import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-5 text-xl font-semibold tracking-tight text-blue-700 sm:text-2xl">{children}</h2>;
}
