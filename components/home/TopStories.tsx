import { EditorialCard } from "@/components/editorial/EditorialCard";
import type { Post } from "@/types/post";

type TopStoriesProps = {
  featured: Post;
  headlines: Post[];
};

export function TopStories({ featured, headlines }: TopStoriesProps) {
  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="top-stories-heading">
      <div className="mx-auto max-w-portal px-4 pt-3 lg:px-0 lg:pt-5">
        <h2 id="top-stories-heading" className="editorial-kicker">
          Öne Çıkanlar
        </h2>
      </div>

      <div className="mx-auto max-w-portal lg:grid lg:grid-cols-12 lg:gap-8 lg:pb-6">
        <div className="lg:col-span-7 lg:min-w-0">
          <EditorialCard post={featured} variant="top-featured" priorityImage headingLevel="h2" />
        </div>

        {headlines.length > 0 ? (
          <div className="border-t border-slate-200 px-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:border-slate-200 lg:px-0 lg:pl-8">
            {headlines.map((post) => (
              <EditorialCard key={post.id} post={post} variant="headline" headingLevel="h3" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
