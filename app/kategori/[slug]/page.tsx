import { CategoryHeader } from "@/components/category/CategoryHeader";
import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <Container className="py-10">
        <h1 className="text-2xl font-semibold">Kategori bulunamadı</h1>
      </Container>
    );
  }

  const categoryPosts = getPostsByCategory(slug);

  return (
    <Container className="py-10">
      <CategoryHeader category={category} />
      <PostList posts={categoryPosts} />
    </Container>
  );
}
