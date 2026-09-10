import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ArticlePlatformCta } from "@/components/post/ArticlePlatformCta";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { getPostBySlug } from "@/lib/posts";
import { getPostCanonicalUrl } from "@/lib/seo/articleJsonLd";
import { staticParamsForPostType } from "@/lib/static-paths";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticParamsForPostType("haber");
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "haber");

  if (!post) {
    return {
      title: "İçerik bulunamadı | Hukuk Portalı",
      description: "Aradığınız haber mevcut değil veya yayından kaldırılmış olabilir."
    };
  }

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt;
  const canonical = getPostCanonicalUrl(post);
  const imageUrl = post.imageUrl?.trim() || undefined;

  return {
    title,
    description,
    keywords: [post.seo?.focusKeyword, ...(post.seo?.secondaryKeywords ?? [])].filter(Boolean) as string[],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      locale: "tr_TR",
      siteName: "Hukuk Portalı",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 675,
              alt: post.imageAlt || post.title
            }
          ]
        : undefined
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined
    }
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "haber");

  if (!post) {
    return (
      <Container wide className="portal-section py-8 sm:py-10">
        <h1 className="text-xl font-semibold sm:text-2xl">İçerik bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Aradığınız haber mevcut değil veya yayından kaldırılmış olabilir.</p>
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
