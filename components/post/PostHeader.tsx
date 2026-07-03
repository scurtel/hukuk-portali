import { CategoryBadge } from "@/components/post/CategoryBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPostDate, formatShortPostDate } from "@/lib/post-display";
import { formatReadingTime, getReadingTimeMinutes } from "@/lib/reading-time";
import type { Post } from "@/types/post";

type PostHeaderProps = {
  post: Post;
};

const HERO_IN_BODY_SLUGS = new Set(["burdan-ricky-gervais-hakkinda-suc-duyurusunda-bulunuyorum"]);

export function PostHeader({ post }: PostHeaderProps) {
  const minutes = getReadingTimeMinutes(post);
  const coverImage = post.imageUrl?.trim() || null;
  const heroInBody = HERO_IN_BODY_SLUGS.has(post.slug);

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
      {!heroInBody && post.authorDisplayName ? (
        <div className="mt-3 space-y-1 text-sm text-ink-muted sm:text-base">
          <p className="font-semibold">Yazan: {post.authorDisplayName}</p>
          <p>Tarih: {formatShortPostDate(post.publishedAt)}</p>
        </div>
      ) : null}
      {!heroInBody && coverImage ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <SafeImage
            src={coverImage}
            alt={post.imageAlt || `${post.title} kapak görseli`}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            fallbackSrc="/images/placeholder-post.jpg"
            priority
          />
        </div>
      ) : null}
      {!heroInBody ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{post.excerpt}</p>
      ) : null}
    </header>
  );
}
