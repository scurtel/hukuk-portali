import { Container } from "@/components/layout/Container";
import { PostCard } from "@/components/post/PostCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPostsByType } from "@/lib/posts";

type LatestNewsListProps = {
  embedded?: boolean;
};

export function LatestNewsList({ embedded }: LatestNewsListProps) {
  const news = getPostsByType("haber", 8);

  const inner = (
    <>
      <SectionTitle href="/haberler">Son Haberler</SectionTitle>
      <div className="divide-y divide-slate-200 rounded-sm border border-slate-200 bg-white px-4 shadow-card sm:px-6">
        {news.map((post) => (
          <PostCard key={post.id} post={post} variant="horizontal" headingLevel="h3" excerptSingleLine />
        ))}
      </div>
    </>
  );

  if (embedded) return <div>{inner}</div>;

  return (
    <section className="portal-section">
      <Container wide>{inner}</Container>
    </section>
  );
}
