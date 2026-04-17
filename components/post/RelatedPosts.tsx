import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByCategory } from "@/lib/posts";

type RelatedPostsProps = {
  currentSlug: string;
  categorySlug: string;
};

export function RelatedPosts({ currentSlug, categorySlug }: RelatedPostsProps) {
  const allInCat = getPostsByCategory(categorySlug);
  const related = allInCat.filter((post) => post.slug !== currentSlug).slice(0, 3);

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
