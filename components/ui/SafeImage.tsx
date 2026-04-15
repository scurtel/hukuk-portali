"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = "/images/placeholder-post.jpg",
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden bg-slate-200">
      {!hasError ? (
        <Image
          {...props}
          src={imageSrc}
          alt={alt}
          className={className}
          onError={() => {
            if (imageSrc !== fallbackSrc) {
              setImageSrc(fallbackSrc);
              return;
            }

            setHasError(true);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
          Görsel yüklenemedi
        </div>
      )}
    </div>
  );
}
