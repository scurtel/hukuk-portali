import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ArticlePlatformCta } from "@/components/post/ArticlePlatformCta";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { getPostBySlug } from "@/lib/posts";
import { staticParamsForPostType } from "@/lib/static-paths";

type AnalysisDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticParamsForPostType("analiz");
}

export async function generateMetadata({ params }: AnalysisDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "analiz");

  if (!post) {
    return {
      title: "İçerik bulunamadı | Hukuk Portalı",
      description: "Aradığınız analiz mevcut değil veya yayından kaldırılmış olabilir."
    };
  }

  return {
    title: `${post.seo?.metaTitle ?? post.title} | Hukuk Portalı`,
    description: post.seo?.metaDescription ?? post.excerpt,
    keywords: [post.seo?.focusKeyword, ...(post.seo?.secondaryKeywords ?? [])].filter(Boolean) as string[]
  };
}

export default async function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "analiz");

  if (!post) {
    return (
      <Container wide className="portal-section py-8 sm:py-10">
        <h1 className="text-xl font-semibold sm:text-2xl">İçerik bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Aradığınız analiz mevcut değil veya yayından kaldırılmış olabilir.</p>
      </Container>
    );
  }

  return (
    <Container wide className="portal-section py-8 sm:py-10">
      <ArticleJsonLd post={post} />
      <PostHeader post={post} />
      <PostContent content={post.content} />
      <hr className="my-10 border-slate-200" />
      <ArticlePlatformCta className="mt-8" />
      <RelatedPosts currentPost={post} />
    </Container>
  );
}
