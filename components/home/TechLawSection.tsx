import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getTechLawPosts } from "@/lib/home";

export function TechLawSection() {
  const posts = getTechLawPosts(6);

  return (
    <section id="hukuk-teknolojileri" className="scroll-mt-28 portal-section">
      <Container wide>
        <SectionTitle href="/kategori/rehber">Hukuk Teknolojileri</SectionTitle>
        <PostList posts={posts} excerptSingleLine />
      </Container>
    </section>
  );
}
