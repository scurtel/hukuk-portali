import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Haberler | Hukuk Portalı",
  description: "Güncel hukuk haberleri, düzenlemeler ve yargı gündemi."
};

export default async function HaberlerPage() {
  const posts = await getPostsByType("haber");

  return (
    <Container className="py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Haberler</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
          Güncel hukuk gündemi ve haber içerikleri veritabanından listelenir.
        </p>
      </header>
      <SectionTitle>Tüm haberler</SectionTitle>
      <PostList posts={posts} />
    </Container>
  );
}
