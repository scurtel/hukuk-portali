import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { getAuthorBySlug } from "@/lib/authors";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = getAuthorBySlug(post.authorSlug);
  const cardImage = `https://source.unsplash.com/featured/?law,justice&sig=${post.id}`;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl">
      <Image
        src={cardImage}
        alt={`${post.title} görseli`}
        width={720}
        height={420}
        className="h-44 w-full object-cover"
      />
      <div className="p-4">
        <div className="mb-3">
          <CategoryBadge slug={post.categorySlug} />
        </div>
        <h3 className="text-lg font-semibold">
          <Link
            href={`/${post.type}/${post.slug}`}
            className="inline-flex min-h-11 items-center text-slate-900 hover:text-blue-700"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        <p className="mt-3 text-xs text-slate-500">
          {author?.name ?? "Bilinmeyen Yazar"} - {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
        </p>
      </div>
    </article>
  );
}
