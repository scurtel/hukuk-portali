import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900",
        className
      )}
      {...props}
    />
  );
}
