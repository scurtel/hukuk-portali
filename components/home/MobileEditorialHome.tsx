import { EditorialSectionBlock } from "@/components/editorial/EditorialSectionBlock";
import { BreakingNewsBar } from "@/components/home/BreakingNewsBar";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { TopStories } from "@/components/home/TopStories";
import { EDITORIAL_HOME_SECTIONS } from "@/lib/editorial-sections";
import { getHomeLeadPost, getHotNewsPosts } from "@/lib/home";

export function MobileEditorialHome() {
  const lead = getHomeLeadPost();
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
