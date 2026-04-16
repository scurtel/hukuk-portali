import Link from "next/link";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { getPostHref } from "@/lib/post-urls";
import type { Author } from "@/types/author";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  author?: Author;
};

export function PostCard({ post, author }: PostCardProps) {
  const href = getPostHref(post);
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
  const displayImage = post.imageUrl && post.imageUrl.length > 0 ? post.imageUrl : cardImage;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl">
      <SafeImage
        src={displayImage}
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
            href={href}
            className="inline-flex min-h-11 items-center text-slate-900 hover:text-blue-700"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        <div className="mt-4">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Devamını Oku
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {author?.name ?? "Bilinmeyen Yazar"} - {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
        </p>
      </div>
    </article>
  );
}
