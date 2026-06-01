import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function Container({ children, className, wide }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", wide ? "max-w-portal" : "max-w-6xl", className)}>{children}</div>
  );
}
