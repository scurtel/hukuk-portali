"use client";

/* Static export: native <img> avoids next/image + local/remote edge cases. */
/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from "react";
import { useState } from "react";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onError"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
  /** LCP: eager yükleme ve yüksek öncelik (next/image `priority` ile aynı amaç) */
  priority?: boolean;
};

/**
 * Static export (output: "export") ortamında next/image + yerel /public yolları
 * bazı barındırıcılarda güvenilir şekilde yüklenmeyebiliyor. Bu yüzden doğrudan
 * <img> kullanılır; uzak URL ve yerel dosya aynı şekilde çalışır.
 */
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

  return (
    <div className="relative overflow-hidden bg-slate-200">
      {!hasError ? (
        <img
          {...rest}
          src={imageSrc}
          alt={alt}
          className={className}
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
      ) : (
        <div className="flex h-full w-full min-h-[11rem] items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
          Görsel yüklenemedi
        </div>
      )}
    </div>
  );
}
