import { AuthorProfile } from "@/components/author/AuthorProfile";
import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { getAuthorBySlug } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return (
      <Container className="py-10">
        <h1 className="text-2xl font-semibold">Yazar bulunamadı</h1>
      </Container>
    );
  }

  const authorPosts = getPostsByAuthor(slug);

  return (
    <Container className="py-10">
      <AuthorProfile author={author} />
      <h2 className="mb-4 text-xl font-semibold">Yazarın Yazıları</h2>
      <PostList posts={authorPosts} />
    </Container>
  );
}
