import { CategoryBadge } from "@/components/post/CategoryBadge";
import type { Post } from "@/types/post";

type PostHeaderProps = {
  post: Post;
};

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-6 space-y-3">
      <CategoryBadge slug={post.categorySlug} />
      <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{post.title}</h1>
      <p className="text-sm text-slate-500">
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</time>
      </p>
      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{post.excerpt}</p>
    </header>
  );
}
