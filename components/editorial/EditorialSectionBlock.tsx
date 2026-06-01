import Link from "next/link";

import { EditorialCard } from "@/components/editorial/EditorialCard";
import type { EditorialSectionConfig } from "@/lib/editorial-sections";
import type { Post } from "@/types/post";

type EditorialSectionBlockProps = {
  section: EditorialSectionConfig;
  posts: Post[];
  /** Mobilde yatay kaydırmalı kart şeridi */
  scrollOnMobile?: boolean;
};

export function EditorialSectionBlock({ section, posts, scrollOnMobile = true }: EditorialSectionBlockProps) {
  if (!posts.length) return null;

  return (
    <section id={section.id} className="scroll-mt-20 border-b border-slate-200/80 bg-white py-5 sm:py-8">
      <div className="mx-auto max-w-portal px-4 sm:px-6">
        <div className="flex items-end justify-between gap-3 border-b-2 border-navy pb-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Bölüm</p>
            <h2 className="editorial-section-title text-navy">{section.title}</h2>
          </div>
          <Link
            href={section.href}
            className="shrink-0 pb-0.5 text-xs font-bold uppercase tracking-wide text-navy transition active:text-gold"
          >
            Tümü →
          </Link>
        </div>

        {scrollOnMobile ? (
          <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="w-[min(82vw,320px)] shrink-0 sm:w-auto">
                <EditorialCard post={post} variant="stack" headingLevel="h3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-200/90">
            {posts.map((post) => (
              <EditorialCard key={post.id} post={post} variant="row" headingLevel="h3" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
