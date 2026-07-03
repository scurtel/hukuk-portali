import { CategoryBadge } from "@/components/post/CategoryBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate } from "@/lib/post-display";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";
import type { Post } from "@/types/post";

type PostHeaderProps = {
  post: Post;
};

export function PostHeader({ post }: PostHeaderProps) {
  const minutes = getReadingTimeMinutes(post);
  const coverImage = post.imageUrl?.trim() || null;

  return (
    <header className="mb-8 border-b border-slate-200 pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge slug={post.categorySlug} size="md" />
        <time dateTime={post.publishedAt} className="text-sm text-ink-subtle">
          {formatPostDate(post.publishedAt)}
        </time>
        <span className="text-sm text-ink-subtle" aria-hidden>
          ·
        </span>
        <span className="text-sm text-ink-subtle">{formatReadingTime(minutes)}</span>
      </div>
      <h1 className="news-headline mt-4 text-navy">{post.title}</h1>
      {post.authorDisplayName ? (
        <p className="mt-3 text-sm font-semibold text-ink-muted sm:text-base">
          Yazan: {post.authorDisplayName}
        </p>
      ) : null}
      {coverImage ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <SafeImage
            src={coverImage}
            alt={post.imageAlt || `${post.title} kapak görseli`}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            fallbackSrc="/images/placeholder-post.jpg"
          />
        </div>
      ) : null}
      <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{post.excerpt}</p>
    </header>
  );
}
