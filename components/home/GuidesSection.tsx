import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export function GuidesSection() {
  const guidePosts = getPostsByType("rehber", 6);

  return (
    <section className="portal-section">
      <Container wide>
        <SectionTitle href="/kategori/rehber">Rehberler</SectionTitle>
        <p className="-mt-3 mb-6 max-w-2xl text-sm text-ink-muted">
          Uygulamaya yönelik rehberler; mevzuat, süreç ve pratik bilgi notları.
        </p>
        <PostList posts={guidePosts} excerptSingleLine />
      </Container>
    </section>
  );
}
