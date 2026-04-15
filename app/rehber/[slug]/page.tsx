import { Container } from "@/components/layout/Container";
import { AuthorBox } from "@/components/post/AuthorBox";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { getPostBySlug } from "@/lib/posts";

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "rehber");

  if (!post) {
    return (
      <Container className="py-10">
        <h1 className="text-2xl font-semibold">İçerik bulunamadı</h1>
        <p className="mt-2 text-slate-600">Aradığınız rehber içeriğine ulaşılamadı.</p>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <PostHeader post={post} />
      <PostContent content={post.content} />
      <hr className="my-10 border-slate-200" />
      <div className="mt-8">
        <AuthorBox authorSlug={post.authorSlug} />
      </div>
      <RelatedPosts currentSlug={post.slug} categorySlug={post.categorySlug} />
    </Container>
  );
}
