import { Container } from "@/components/layout/Container";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { AuthorBox } from "@/components/post/AuthorBox";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { getAuthorBySlug } from "@/lib/authors";
import { getPostBySlug } from "@/lib/posts";
import { staticParamsForPostType } from "@/lib/static-paths";

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticParamsForPostType("rehber");
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "rehber");

  if (!post) {
    return (
      <Container className="py-8 sm:py-10">
        <h1 className="text-xl font-semibold sm:text-2xl">İçerik bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Aradığınız rehber içeriğine ulaşılamadı.</p>
      </Container>
    );
  }

  const author = getAuthorBySlug(post.authorSlug);

  return (
    <Container className="py-8 sm:py-10">
      <ArticleJsonLd post={post} author={author} />
      <PostHeader post={post} author={author} />
      <PostContent content={post.content} />
      <hr className="my-10 border-slate-200" />
      <div className="mt-8">
        <AuthorBox author={author} />
      </div>
      <RelatedPosts currentSlug={post.slug} categorySlug={post.categorySlug} />
    </Container>
  );
}
