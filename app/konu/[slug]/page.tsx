import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/post/PostList";
import { getPostsForTopic, getTopicBySlug, TOPICS } from "@/lib/topics";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Konu bulunamadı" };

  return {
    title: topic.title,
    description: topic.seoDescription,
    alternates: { canonical: `https://hukukportali.com/konu/${topic.slug}` }
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = getPostsForTopic(slug);
  const uniquePosts = posts.filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i);

  return (
    <div className="portal-section">
      <Container wide className="py-4 sm:py-6">
        <header className="mb-8 border-b-2 border-brand-900 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-red">Konu</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-brand-900 sm:text-4xl">{topic.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">{topic.description}</p>
        </header>
        {uniquePosts.length ? (
          <PostList posts={uniquePosts} excerptSingleLine />
        ) : (
          <p className="text-sm text-ink-muted">Bu konuda henüz listelenecek içerik yok.</p>
        )}
      </Container>
    </div>
  );
}
