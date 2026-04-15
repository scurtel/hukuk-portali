import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { getAuthorBySlug } from "@/lib/authors";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = getAuthorBySlug(post.authorSlug);

  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <CategoryBadge slug={post.categorySlug} />
      </div>
      <h3 className="text-lg font-semibold">
        <Link href={`/${post.type}/${post.slug}`} className="hover:text-brand-700">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
      <p className="mt-3 text-xs text-slate-500">
        {author?.name ?? "Bilinmeyen Yazar"} - {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
      </p>
    </article>
  );
}
