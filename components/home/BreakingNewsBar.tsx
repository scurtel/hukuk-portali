import Link from "next/link";

import { getHotNewsPosts } from "@/lib/home";
import { getPostHref } from "@/lib/post-urls";

export function BreakingNewsBar() {
  const items = getHotNewsPosts(3);
  if (!items.length) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50" aria-label="Son dakika">
      <div className="mx-auto max-w-portal px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex shrink-0 items-center gap-2 border-r-2 border-gold pr-3 lg:pr-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold lg:text-[10px]">
              Son Dakika
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
            {items.map((post, index) => (
              <Link
                key={post.id}
                href={getPostHref(post)}
                className="block text-sm font-medium leading-snug text-navy transition hover:text-gold line-clamp-2 lg:line-clamp-1 lg:flex-1 lg:text-[13px]"
              >
                {index > 0 ? (
                  <span className="mr-2 hidden text-gold/60 lg:inline" aria-hidden>
                    |
                  </span>
                ) : null}
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
