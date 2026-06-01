import Link from "next/link";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";
import { truncatePostCardExcerpt } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";

export type EditorialCardVariant = "top-featured" | "headline" | "row";

type EditorialCardProps = {
  post: Post;
  variant?: EditorialCardVariant;
  headingLevel?: "h2" | "h3";
  priorityImage?: boolean;
};

function ArticleMeta({ post, className }: { post: Post; className?: string }) {
  const minutes = getReadingTimeMinutes(post);
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 text-[11px] text-ink-subtle", className)}>
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
  variant = "row",
  headingLevel = "h3",
  priorityImage = false
}: EditorialCardProps) {
  const href = getPostHref(post);
  const image = getPostDisplayImage(post);
  const TitleTag = headingLevel;

  if (variant === "headline") {
    return (
      <article className="border-b border-slate-200/80 py-3 last:border-b-0">
        <Link href={href} className="block">
          <CategoryLabel slug={post.categorySlug} linked={false} />
          <TitleTag className="editorial-title mt-1 line-clamp-3 text-[1.05rem] leading-snug lg:text-[1.125rem]">
            {post.title}
          </TitleTag>
          <ArticleMeta post={post} className="mt-1.5" />
        </Link>
      </article>
    );
  }

  if (variant === "top-featured") {
    const excerpt = truncatePostCardExcerpt(post.excerpt, 150);
    return (
      <article className="w-full">
        <Link href={href} className="group block">
          <div className="relative h-44 w-full overflow-hidden bg-navy-light sm:h-48 lg:h-[300px] xl:h-[340px]">
            <SafeImage
              src={image}
              alt=""
              width={1200}
              height={675}
              priority={priorityImage}
              fallbackSrc="/images/placeholder-post.jpg"
            />
          </div>
          <div className="px-4 pb-4 pt-3 lg:px-0 lg:pb-0 lg:pt-4">
            <CategoryLabel slug={post.categorySlug} linked={false} />
            <TitleTag className="editorial-hero-title mt-2 text-navy">{post.title}</TitleTag>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted lg:text-base">
              {excerpt}
            </p>
            <ArticleMeta post={post} className="mt-2" />
          </div>
        </Link>
      </article>
    );
  }

  const excerpt = truncatePostCardExcerpt(post.excerpt, 100);
  return (
    <article className="border-b border-slate-200/80 py-3 last:border-b-0">
      <Link href={href} className="group flex gap-3 sm:gap-4">
        <div className="relative h-[4.25rem] w-[5.5rem] shrink-0 overflow-hidden bg-navy-light sm:h-20 sm:w-28">
          <SafeImage
            src={image}
            alt=""
            width={280}
            height={160}
            fallbackSrc="/images/placeholder-post.jpg"
            priority={priorityImage}
          />
        </div>
        <div className="min-w-0 flex-1">
          <CategoryLabel slug={post.categorySlug} linked={false} />
          <TitleTag className="editorial-title mt-0.5 line-clamp-3 text-[0.98rem] leading-snug sm:text-base">
            {post.title}
          </TitleTag>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted sm:line-clamp-1">{excerpt}</p>
          <ArticleMeta post={post} className="mt-1" />
        </div>
      </Link>
    </article>
  );
}
