import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PostCard } from "@/components/post/PostCard";
import { getPostsByType } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Haberler",
  description: "Güncel hukuk haberleri, mevzuat gelişmeleri, yargı gündemi ve teknoloji."
};

export default function HaberlerPage() {
  const posts = getPostsByType("haber");

  return (
    <div className="portal-section">
      <Container wide className="py-4 sm:py-6">
        <header className="mb-8 border-b-2 border-brand-900 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-red">Haber Merkezi</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-brand-900 sm:text-4xl">Haberler</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Mevzuat, yargı, yapay zekâ ve dijital dönüşüm odaklı güncel hukuk haberleri.
          </p>
        </header>
        <div className="divide-y divide-slate-200 rounded-sm border border-slate-200 bg-white px-4 shadow-card sm:px-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="horizontal" headingLevel="h2" excerptSingleLine />
          ))}
        </div>
      </Container>
    </div>
  );
}
