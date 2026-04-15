import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export function LatestNews() {
  const newsPosts = getPostsByType("haber");

  return (
    <section className="py-10">
      <Container>
        <SectionTitle>Son Haberler</SectionTitle>
        <PostList posts={newsPosts} />
      </Container>
    </section>
  );
}
