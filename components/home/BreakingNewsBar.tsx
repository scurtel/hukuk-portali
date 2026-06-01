import Link from "next/link";

import { getHotNewsPosts } from "@/lib/home";
import { getPostHref } from "@/lib/post-urls";

export function BreakingNewsBar() {
  const items = getHotNewsPosts(2);
  if (!items.length) return null;

  return (
    <section
      className="border-b border-slate-200 bg-slate-50"
      aria-label="Son dakika"
    >
      <div className="mx-auto max-w-portal px-4 py-2">
        <div className="flex items-stretch gap-3">
          <div className="flex shrink-0 flex-col justify-center border-r-2 border-gold pr-3">
            <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.22em] text-gold">
              Son
            </span>
            <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.22em] text-navy">
              Dakika
            </span>
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            {items.map((post) => (
              <Link
                key={post.id}
                href={getPostHref(post)}
                className="block text-sm font-medium leading-snug text-navy transition active:text-gold line-clamp-2"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
