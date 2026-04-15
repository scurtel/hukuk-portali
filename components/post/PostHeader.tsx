import { CategoryBadge } from "@/components/post/CategoryBadge";
import { getAuthorBySlug } from "@/lib/authors";
import type { Post } from "@/types/post";

type PostHeaderProps = {
  post: Post;
};

export function PostHeader({ post }: PostHeaderProps) {
  const author = getAuthorBySlug(post.authorSlug);

  return (
    <header className="mb-6 space-y-3">
      <CategoryBadge slug={post.categorySlug} />
      <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
      <p className="text-sm text-slate-500">
        {author?.name ?? "Bilinmeyen Yazar"} - {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
      </p>
      <p className="text-slate-700">{post.excerpt}</p>
    </header>
  );
}
