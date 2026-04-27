import type { Post } from "@/types/post";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getRelatedPosts } from "@/lib/posts";

type RelatedPostsProps = {
  currentPost: Post;
};

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const related = getRelatedPosts(currentPost, 3);

  if (!related.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <SectionTitle>Benzer İçerikler</SectionTitle>
      <PostList posts={related} />
    </section>
  );
}
