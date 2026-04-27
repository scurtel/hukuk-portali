import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { AuthorBox } from "@/components/post/AuthorBox";
import { PostContent } from "@/components/post/PostContent";
import { PostHeader } from "@/components/post/PostHeader";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { SafeImage } from "@/components/ui/SafeImage";
import { getAuthorBySlug } from "@/lib/authors";
import { getPostBySlug } from "@/lib/posts";
import { staticParamsForPostType } from "@/lib/static-paths";

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200";

const COVER_IMAGES_BY_SLUG: Record<string, string> = {
  "yapay-zeka-avukat-sorumlulugu": DEFAULT_COVER_IMAGE,
  "adana-bosanma-arabuluculugu": DEFAULT_COVER_IMAGE
};

type AnalysisSeoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return staticParamsForPostType("analiz");
}

export async function generateMetadata({ params }: AnalysisSeoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "analiz");

  if (!post) {
    return {
      title: "İçerik bulunamadı | Hukuk Portalı",
      description: "Aradığınız analiz içeriğine ulaşılamadı."
    };
  }

  if (slug === "yapay-zeka-avukat-sorumlulugu") {
    return {
      title: "Yapay Zeka ve Avukatın Sorumluluğu | Hukuk Portalı",
      description:
        "ABD’deki dikkat çeken karar, yapay zekâ destekli dilekçelerde doğrulama zorunluluğunu ve avukatın mesleki özen yükümlülüğünü yeniden gündeme getiriyor."
    };
  }

  if (slug === "adana-bosanma-arabuluculugu") {
    return {
      title: "Adana Boşanma Arabuluculuğu ve Avukatın Rolü | Hukuk Portalı",
      description:
        "Adana boşanma arabuluculuğu sürecinde avukatın rolünü, aile hukuku uygulamasındaki kritik adımları ve vekalet sorumluluğunu kapsamlı biçimde inceliyoruz."
    };
  }

  return {
    title: `${post.seo?.metaTitle ?? post.title} | Hukuk Portalı`,
    description: post.seo?.metaDescription ?? post.excerpt,
    keywords: [post.seo?.focusKeyword, ...(post.seo?.secondaryKeywords ?? [])].filter(Boolean) as string[]
  };
}

export default async function AnalysisSeoPage({ params }: AnalysisSeoPageProps) {
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

  const author = getAuthorBySlug(post.authorSlug);

  const coverImage =
    post.imageUrl && post.imageUrl.length > 0
      ? post.imageUrl
      : COVER_IMAGES_BY_SLUG[slug] ?? DEFAULT_COVER_IMAGE;

  return (
    <Container className="py-8 sm:py-10">
      <ArticleJsonLd post={post} author={author} />
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <SafeImage
          src={coverImage}
          alt={`${post.title} kapak görseli`}
          width={1200}
          height={675}
          className="h-56 w-full object-cover sm:h-72"
          fallbackSrc="/images/placeholder-post.jpg"
        />
      </div>

      <PostHeader post={post} author={author} />
      <PostContent content={post.content} />
      <hr className="my-10 border-slate-200" />
      <div className="mt-8">
        <AuthorBox author={author} />
      </div>
      <RelatedPosts currentPost={post} />
    </Container>
  );
}

