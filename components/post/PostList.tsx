import type { Post } from "@/types/post";

import { getAuthorsBySlugs } from "@/lib/authors";

import { PostCard } from "./PostCard";

type PostListProps = {
  posts: Post[];
  excerptSingleLine?: boolean;
};

export function PostList({ posts, excerptSingleLine = false }: PostListProps) {
  if (!posts.length) {
    return <p className="text-sm text-slate-500">Bu bölümde henüz içerik bulunmuyor.</p>;
  }

  const authorMap = getAuthorsBySlugs(posts.map((p) => p.authorSlug));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={authorMap.get(post.authorSlug)}
          excerptSingleLine={excerptSingleLine}
        />
      ))}
    </div>
  );
}
