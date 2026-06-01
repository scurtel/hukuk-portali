import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { truncatePostCardExcerpt } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";

export type PostCardVariant = "grid" | "compact" | "horizontal" | "featured-side";

type PostCardProps = {
  post: Post;
  variant?: PostCardVariant;
  excerptSingleLine?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
};

function PostTitle({
  post,
  href,
  className,
  as: Tag
}: {
  post: Post;
  href: string;
  className?: string;
  as: "h2" | "h3" | "h4";
}) {
  return (
    <Tag className={className}>
      <Link href={href} className="transition hover:text-brand-500">
        {post.title}
      </Link>
    </Tag>
  );
}

export function PostCard({
  post,
  variant = "grid",
  excerptSingleLine = false,
  headingLevel = "h3"
}: PostCardProps) {
  const href = getPostHref(post);
  const displayImage = getPostDisplayImage(post);
  const excerptPreview = truncatePostCardExcerpt(post.excerpt, variant === "compact" ? 100 : 200);

  if (variant === "featured-side") {
    return (
      <article className="group flex gap-3 border-b border-slate-200 py-3 last:border-0">
        <Link href={href} className="relative block h-20 w-28 shrink-0 overflow-hidden bg-slate-100 sm:h-24 sm:w-32">
          <SafeImage
            src={displayImage}
            alt={post.imageAlt ?? post.title}
            width={320}
            height={200}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            fallbackSrc="/images/placeholder-post.jpg"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <CategoryBadge slug={post.categorySlug} />
          <PostTitle
            post={post}
            href={href}
            as={headingLevel}
            className="news-subhead mt-2 line-clamp-3 text-base sm:text-lg"
          />
          <time dateTime={post.publishedAt} className="mt-1 block text-xs text-ink-subtle">
            {formatPostDate(post.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
          <SafeImage
            src={displayImage}
            alt={post.imageAlt ?? post.title}
            width={400}
            height={250}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fallbackSrc="/images/placeholder-post.jpg"
          />
          <div className="absolute left-2 top-2">
            <CategoryBadge slug={post.categorySlug} />
          </div>
        </Link>
        <PostTitle post={post} href={href} as={headingLevel} className="news-subhead mt-2 line-clamp-3 text-base" />
        <time dateTime={post.publishedAt} className="mt-1 block text-xs text-ink-subtle">
          {formatPostDate(post.publishedAt)}
        </time>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group flex flex-col gap-4 border-b border-slate-200 py-5 last:border-0 sm:flex-row sm:gap-6">
        <Link href={href} className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:h-32 sm:w-48">
          <SafeImage
            src={displayImage}
            alt={post.imageAlt ?? post.title}
            width={480}
            height={270}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            fallbackSrc="/images/placeholder-post.jpg"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={post.categorySlug} />
            <time dateTime={post.publishedAt} className="text-xs text-ink-subtle">
              {formatPostDate(post.publishedAt)}
            </time>
          </div>
          <PostTitle post={post} href={href} as={headingLevel} className="news-subhead mt-2 text-lg sm:text-xl" />
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed text-ink-muted",
              excerptSingleLine ? "line-clamp-2" : "line-clamp-3"
            )}
            title={post.excerpt}
          >
            {excerptPreview}
          </p>
          <Link
            href={href}
            className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-brand-500 transition hover:text-accent-red"
          >
            Devamını Oku →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        <SafeImage
          src={displayImage}
          alt={post.imageAlt ?? post.title}
          width={720}
          height={420}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          fallbackSrc="/images/placeholder-post.jpg"
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge slug={post.categorySlug} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <PostTitle post={post} href={href} as={headingLevel} className="news-subhead text-lg" />
        <p
          className={cn("mt-2 flex-1 text-sm text-ink-muted", excerptSingleLine ? "line-clamp-2" : "line-clamp-3")}
          title={post.excerpt}
        >
          {excerptPreview}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <time dateTime={post.publishedAt} className="text-xs text-ink-subtle">
            {formatPostDate(post.publishedAt)}
          </time>
          <Link
            href={href}
            className="text-xs font-bold uppercase tracking-wide text-brand-700 transition hover:text-accent-red"
          >
            Oku
          </Link>
        </div>
      </div>
    </article>
  );
}
