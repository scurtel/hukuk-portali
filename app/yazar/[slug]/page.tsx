import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { getPostsByAuthor } from "@/lib/posts";
import { staticParamsForAuthors } from "@/lib/static-paths";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "İçerik Arşivi | Hukuk Portalı",
  description: "Hukukportali.com üzerinde yayımlanan haber, rehber ve analiz içerikleri.",
  robots: { index: false, follow: true }
};

export function generateStaticParams() {
  return staticParamsForAuthors();
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const authorPosts = getPostsByAuthor(slug);

  if (!authorPosts.length) {
    notFound();
  }

  return (
    <Container className="py-8 sm:py-10">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">İçerik Arşivi</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          Hukukportali.com&apos;da yayımlanan seçilmiş haber, rehber ve analiz içerikleri. Platform bağımsız bir
          dijital yayın ve teknoloji yayınıdır; kişisel avukatlık tanıtımı içermez.
        </p>
      </header>
      <PostList posts={authorPosts} />
    </Container>
  );
}
