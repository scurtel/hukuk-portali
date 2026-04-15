import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export function GuidesSection() {
  const guidePosts = getPostsByType("rehber");

  return (
    <section className="py-10">
      <Container>
        <SectionTitle>Rehberler</SectionTitle>
        <PostList posts={guidePosts} />
      </Container>
    </section>
  );
}
