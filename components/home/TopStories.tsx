import { EditorialCard } from "@/components/editorial/EditorialCard";
import type { Post } from "@/types/post";

type TopStoriesProps = {
  featured: Post;
  headlines: Post[];
};

export function TopStories({ featured, headlines }: TopStoriesProps) {
  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="top-stories-heading">
      <div className="mx-auto max-w-portal px-4 pt-3 pb-2 lg:px-6 lg:pt-5 lg:pb-0">
        <h2 id="top-stories-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          Top Stories
        </h2>
      </div>

      <div className="mx-auto max-w-portal lg:grid lg:grid-cols-12 lg:gap-8 lg:px-6 lg:pb-6">
        <div className="lg:col-span-7 lg:min-w-0">
          <EditorialCard post={featured} variant="top-featured" priorityImage headingLevel="h2" />
        </div>

        {headlines.length > 0 ? (
          <div className="divide-y divide-slate-200/90 border-t border-slate-200/90 px-4 lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:border-l lg:border-slate-200 lg:px-0 lg:pl-8">
            {headlines.map((post) => (
              <EditorialCard key={post.id} post={post} variant="headline" headingLevel="h3" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
