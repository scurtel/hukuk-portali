import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export async function AnalysisSection() {
  const analysisPosts = await getPostsByType("analiz");

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <Container>
        <SectionTitle>Analizler</SectionTitle>
        <PostList posts={analysisPosts} />
      </Container>
    </section>
  );
}
