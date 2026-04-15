import type { Post } from "@/types/post";

import { PostCard } from "./PostCard";

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  if (!posts.length) {
    return <p className="text-sm text-slate-500">Bu bölümde henüz içerik bulunmuyor.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
