import { Container } from "@/components/layout/Container";
import { AuthorBox } from "@/components/post/AuthorBox";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { getPostBySlug } from "@/lib/posts";

type AnalysisDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "analiz");

  if (!post) {
    return (
      <Container className="py-8 sm:py-10">
        <h1 className="text-xl font-semibold sm:text-2xl">İçerik bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Aradığınız analiz içeriğine ulaşılamadı.</p>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-10">
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
