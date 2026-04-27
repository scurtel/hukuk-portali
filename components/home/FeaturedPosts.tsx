import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getFeaturedPosts } from "@/lib/posts";

export function FeaturedPosts() {
  const featuredPosts = getFeaturedPosts();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionTitle>Öne Çıkan İçerikler</SectionTitle>
        <PostList posts={featuredPosts} excerptSingleLine />
      </Container>
    </section>
  );
}
