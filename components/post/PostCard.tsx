import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { getAuthorBySlug } from "@/lib/authors";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const author = getAuthorBySlug(post.authorSlug);
  const unsplashImages = [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1000&q=80"
  ];
  const imageIndex = post.id
    .toString()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % unsplashImages.length;
  const cardImage = unsplashImages[imageIndex];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl">
      <SafeImage
        src={cardImage}
        alt={`${post.title} görseli`}
        width={720}
        height={420}
        className="h-44 w-full object-cover"
        fallbackSrc="/images/placeholder-post.jpg"
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
