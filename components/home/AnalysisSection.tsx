import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export function AnalysisSection() {
  const analysisPosts = getPostsByType("analiz");

  return (
    <section className="py-10">
      <Container>
        <SectionTitle>Analizler</SectionTitle>
        <PostList posts={analysisPosts} />
      </Container>
    </section>
  );
}
