"use client";

/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
};

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder-post.jpg",
  className,
  loading,
  decoding = "async",
  fetchPriority,
  priority,
  ...rest
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const resolvedLoading = priority ? "eager" : loading ?? "lazy";
  const resolvedFetchPriority = priority ? "high" : fetchPriority;

  if (hasError) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[4rem] w-full items-center justify-center bg-slate-200 text-xs text-slate-500",
          className
        )}
      >
        Görsel yok
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={imageSrc}
      alt={alt}
      className={cn("block h-full w-full object-cover", className)}
      loading={resolvedLoading}
      decoding={decoding}
      fetchPriority={resolvedFetchPriority}
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
          return;
        }
        setHasError(true);
      }}
    />
  );
}
