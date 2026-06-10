import { EditorialSectionBlock } from "@/components/editorial/EditorialSectionBlock";
import { BreakingNewsBar } from "@/components/home/BreakingNewsBar";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { TopStories } from "@/components/home/TopStories";
import { EDITORIAL_HOME_SECTIONS } from "@/lib/editorial-sections";
import { getHomeFeaturedPosts, getHotNewsPosts, getLegalTechSpotlightPosts } from "@/lib/home";

function getLeadStory() {
  const spotlight = getLegalTechSpotlightPosts();
  if (spotlight[0]) return spotlight[0];
  const featured = getHomeFeaturedPosts();
  const news = getHotNewsPosts(12);
  return featured[0] ?? news[0];
}

export function MobileEditorialHome() {
  const lead = getLeadStory();
  const headlinePool = getHotNewsPosts(12).filter((p) => p.slug !== lead?.slug);
  const topHeadlines = headlinePool.slice(0, 4);

  const usedSlugs = new Set<string>();
  if (lead) usedSlugs.add(lead.slug);
  topHeadlines.forEach((p) => usedSlugs.add(p.slug));

  return (
    <div className="overflow-x-hidden bg-white">
      <BreakingNewsBar />

      <div className="mx-auto w-full max-w-portal lg:px-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:pt-2">
          <div className="min-w-0 lg:col-span-8">
            {lead ? <TopStories featured={lead} headlines={topHeadlines} /> : null}

            <div className="lg:space-y-1">
              {EDITORIAL_HOME_SECTIONS.map((section) => {
                const raw = section.getPosts(6);
                const posts =
                  section.id === "hukuk-teknolojileri"
                    ? raw
                    : raw.filter((p) => !usedSlugs.has(p.slug));
                posts.slice(0, 4).forEach((p) => usedSlugs.add(p.slug));
                return (
                  <EditorialSectionBlock key={section.id} section={section} posts={posts} maxPosts={4} />
                );
              })}
            </div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block lg:py-6">
            <HomeSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
