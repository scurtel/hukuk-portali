import { EditorialSectionBlock } from "@/components/editorial/EditorialSectionBlock";
import { BreakingNewsBar } from "@/components/home/BreakingNewsBar";
import { TopStories } from "@/components/home/TopStories";
import { EDITORIAL_HOME_SECTIONS } from "@/lib/editorial-sections";
import { getHotNewsPosts } from "@/lib/home";
import { getFeaturedPosts, getPostsByType } from "@/lib/posts";

function getLeadStory() {
  const featured = getFeaturedPosts();
  const news = getPostsByType("haber");
  return featured[0] ?? news[0];
}

export function MobileEditorialHome() {
  const lead = getLeadStory();
  const pool = getHotNewsPosts(12);
  const headlinePool = pool.filter((p) => p.slug !== lead?.slug);
  const topHeadlines = headlinePool.slice(0, 4);

  const usedSlugs = new Set<string>();
  if (lead) usedSlugs.add(lead.slug);
  topHeadlines.forEach((p) => usedSlugs.add(p.slug));

  return (
    <div className="bg-white">
      <BreakingNewsBar />

      {lead ? <TopStories featured={lead} headlines={topHeadlines} /> : null}

      {EDITORIAL_HOME_SECTIONS.map((section) => {
        const posts = section.getPosts(6).filter((p) => !usedSlugs.has(p.slug));
        posts.slice(0, 4).forEach((p) => usedSlugs.add(p.slug));
        return <EditorialSectionBlock key={section.id} section={section} posts={posts} maxPosts={4} />;
      })}
    </div>
  );
}
