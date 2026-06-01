import { EditorialCard } from "@/components/editorial/EditorialCard";
import type { Post } from "@/types/post";

type TopStoriesProps = {
  featured: Post;
  headlines: Post[];
};

export function TopStories({ featured, headlines }: TopStoriesProps) {
  return (
    <section className="border-b border-slate-200 bg-white" aria-labelledby="top-stories-heading">
      <div className="mx-auto max-w-portal px-4 pt-3 pb-1">
        <h2 id="top-stories-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          Top Stories
        </h2>
      </div>
      <EditorialCard post={featured} variant="top-featured" priorityImage headingLevel="h2" />
      {headlines.length > 0 ? (
        <div className="mx-auto max-w-portal divide-y divide-slate-200/90 border-t border-slate-200/90 px-4">
          {headlines.map((post) => (
            <EditorialCard key={post.id} post={post} variant="headline" headingLevel="h3" />
          ))}
        </div>
      ) : null}
    </section>
  );
}
