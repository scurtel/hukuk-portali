import Link from "next/link";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";
import { truncatePostCardExcerpt } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";

export type EditorialCardVariant = "featured" | "stack" | "row";

type EditorialCardProps = {
  post: Post;
  variant?: EditorialCardVariant;
  headingLevel?: "h2" | "h3";
  priorityImage?: boolean;
};

function ArticleMeta({ post }: { post: Post }) {
  const minutes = getReadingTimeMinutes(post);
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-subtle">
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
      <span className="text-ink-subtle/50" aria-hidden>
        ·
      </span>
      <span>{formatReadingTime(minutes)}</span>
    </p>
  );
}

export function EditorialCard({
  post,
  variant = "stack",
  headingLevel = "h3",
  priorityImage = false
}: EditorialCardProps) {
  const href = getPostHref(post);
  const image = getPostDisplayImage(post);
  const TitleTag = headingLevel;
  const excerpt = truncatePostCardExcerpt(post.excerpt, variant === "row" ? 120 : 160);

  if (variant === "row") {
    return (
      <article className="group border-b border-slate-200/90 py-4 last:border-0">
        <Link href={href} className="flex gap-4">
          <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden bg-navy sm:h-28 sm:w-36">
            <SafeImage
              src={image}
              alt=""
              width={360}
              height={240}
              className="h-full w-full object-cover transition duration-300 group-active:scale-[1.03]"
              fallbackSrc="/images/placeholder-post.jpg"
              priority={priorityImage}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <CategoryLabel slug={post.categorySlug} />
            <TitleTag className="editorial-title mt-2 line-clamp-3 text-[1.05rem] leading-snug sm:text-xl">
              {post.title}
            </TitleTag>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{excerpt}</p>
            <div className="mt-2">
              <ArticleMeta post={post} />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={href} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-navy sm:aspect-[16/9]">
            <SafeImage
              src={image}
              alt=""
              width={1200}
              height={800}
              className="h-full w-full object-cover transition duration-500 group-active:scale-[1.02]"
              fallbackSrc="/images/placeholder-post.jpg"
              priority={priorityImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <CategoryLabel slug={post.categorySlug} className="text-gold-light" />
              <h2 className="editorial-hero-title mt-2 text-white">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/85">{excerpt}</p>
              <div className="mt-3 text-white/75">
                <ArticleMeta post={post} />
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-editorial">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy">
          <SafeImage
            src={image}
            alt=""
            width={800}
            height={500}
            className="h-full w-full object-cover transition duration-300 group-active:scale-[1.02]"
            fallbackSrc="/images/placeholder-post.jpg"
            priority={priorityImage}
          />
        </div>
        <div className="p-4">
          <CategoryLabel slug={post.categorySlug} />
          <TitleTag className={cn("editorial-title mt-2 line-clamp-3")}>{post.title}</TitleTag>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{excerpt}</p>
          <div className="mt-3">
            <ArticleMeta post={post} />
          </div>
        </div>
      </Link>
    </article>
  );
}
