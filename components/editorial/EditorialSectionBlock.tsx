import { EditorialCard } from "@/components/editorial/EditorialCard";
import { EditorialSectionHeader } from "@/components/editorial/EditorialSectionHeader";
import type { EditorialSectionConfig } from "@/lib/editorial-sections";
import type { Post } from "@/types/post";

type EditorialSectionBlockProps = {
  section: EditorialSectionConfig;
  posts: Post[];
  maxPosts?: number;
};

export function EditorialSectionBlock({ section, posts, maxPosts = 4 }: EditorialSectionBlockProps) {
  const visible = posts.slice(0, maxPosts);
  if (!visible.length) return null;

  return (
    <section id={section.id} className="scroll-mt-24 border-b border-slate-200/80 bg-white lg:border-0">
      <div className="py-3 sm:py-4 lg:py-5">
        <EditorialSectionHeader title={section.title} href={section.href} />
        <div className="mt-2 divide-y divide-slate-200/90 lg:mt-4 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:divide-y-0">
          {visible.map((post) => (
            <EditorialCard key={post.id} post={post} variant="compact" headingLevel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
