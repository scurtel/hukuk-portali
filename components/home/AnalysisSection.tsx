import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export function AnalysisSection() {
  const analysisPosts = getPostsByType("analiz", 6);

  return (
    <section className="portal-section-alt">
      <Container wide>
        <SectionTitle href="/kategori/analiz">Analizler</SectionTitle>
        <p className="-mt-3 mb-6 max-w-2xl text-sm text-ink-muted">
          Derinlemesine hukuki değerlendirmeler, içtihat yorumları ve sektör analizleri.
        </p>
        <PostList posts={analysisPosts} excerptSingleLine />
      </Container>
    </section>
  );
}
