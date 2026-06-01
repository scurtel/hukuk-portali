import { CategoryBadge } from "@/components/post/CategoryBadge";
import { formatPostDate } from "@/lib/post-display";
import type { Post } from "@/types/post";

type PostHeaderProps = {
  post: Post;
};

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8 border-b border-slate-200 pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge slug={post.categorySlug} size="md" />
        <time dateTime={post.publishedAt} className="text-sm text-ink-subtle">
          {formatPostDate(post.publishedAt)}
        </time>
      </div>
      <h1 className="news-headline mt-4 text-ink">{post.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{post.excerpt}</p>
    </header>
  );
}
