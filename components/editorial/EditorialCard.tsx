import Link from "next/link";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";
import { truncatePostCardExcerpt } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";

export type EditorialCardVariant = "top-featured" | "headline" | "compact" | "row";

type EditorialCardProps = {
  post: Post;
  variant?: EditorialCardVariant;
  headingLevel?: "h2" | "h3";
  priorityImage?: boolean;
};

function ArticleMeta({ post, className }: { post: Post; className?: string }) {
  const minutes = getReadingTimeMinutes(post);
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0 text-[11px] text-ink-subtle", className)}>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
      <span className="text-ink-subtle/40" aria-hidden>
        ·
      </span>
      <span>{formatReadingTime(minutes)}</span>
    </p>
  );
}

export function EditorialCard({
  post,
  variant = "compact",
  headingLevel = "h3",
  priorityImage = false
}: EditorialCardProps) {
  const href = getPostHref(post);
  const image = getPostDisplayImage(post);
  const TitleTag = headingLevel;

  if (variant === "headline") {
    return (
      <article className="group py-3">
        <Link href={href} className="block">
          <CategoryLabel slug={post.categorySlug} linked={false} />
          <TitleTag className="editorial-title mt-1 line-clamp-3 text-[1.0625rem] leading-snug">
            {post.title}
          </TitleTag>
          <ArticleMeta post={post} className="mt-1.5" />
        </Link>
      </article>
    );
  }

  if (variant === "top-featured") {
    const excerpt = truncatePostCardExcerpt(post.excerpt, 100);
    return (
      <article className="group w-full">
        <Link href={href} className="mx-auto block max-w-portal px-4 pb-3">
          <div className="relative aspect-video max-h-[9.5rem] w-full overflow-hidden bg-navy-light sm:max-h-[11rem]">
            <SafeImage
              src={image}
              alt=""
              width={800}
              height={450}
              className="h-full w-full object-cover transition duration-300 group-active:opacity-95"
              fallbackSrc="/images/placeholder-post.jpg"
              priority={priorityImage}
            />
          </div>
          <CategoryLabel slug={post.categorySlug} className="mt-3" />
          <TitleTag className="editorial-hero-title mt-1.5 text-navy">{post.title}</TitleTag>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{excerpt}</p>
          <ArticleMeta post={post} className="mt-2" />
        </Link>
      </article>
    );
  }

  if (variant === "row") {
    const excerpt = truncatePostCardExcerpt(post.excerpt, 90);
    return (
      <article className="group w-full border-b border-slate-200/90 py-3 last:border-0">
        <Link href={href} className="flex gap-3">
          <div className="relative aspect-video h-16 w-28 shrink-0 overflow-hidden bg-navy-light sm:h-[4.5rem] sm:w-32">
            <SafeImage
              src={image}
              alt=""
              width={320}
              height={180}
              className="h-full w-full object-cover"
              fallbackSrc="/images/placeholder-post.jpg"
              priority={priorityImage}
            />
          </div>
          <div className="min-w-0 flex-1">
            <CategoryLabel slug={post.categorySlug} linked={false} />
            <TitleTag className="editorial-title mt-1 line-clamp-3 text-base leading-snug">
              {post.title}
            </TitleTag>
            <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{excerpt}</p>
            <ArticleMeta post={post} className="mt-1" />
          </div>
        </Link>
      </article>
    );
  }

  const excerpt = truncatePostCardExcerpt(post.excerpt, 110);
  return (
    <article className="group w-full border-b border-slate-200/90 py-3 last:border-0">
      <Link href={href} className="block w-full">
        <div className="relative aspect-video max-h-[7rem] w-full overflow-hidden bg-navy-light sm:max-h-[8.5rem]">
          <SafeImage
            src={image}
            alt=""
            width={800}
            height={450}
            className="h-full w-full object-cover transition duration-300 group-active:opacity-95"
            fallbackSrc="/images/placeholder-post.jpg"
            priority={priorityImage}
          />
        </div>
        <div className="pt-2.5">
          <CategoryLabel slug={post.categorySlug} linked={false} />
          <TitleTag className="editorial-title mt-1 line-clamp-3 text-[1.0625rem] leading-snug">
            {post.title}
          </TitleTag>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">{excerpt}</p>
          <ArticleMeta post={post} className="mt-1.5" />
        </div>
      </Link>
    </article>
  );
}
