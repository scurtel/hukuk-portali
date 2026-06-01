import Link from "next/link";

import { getHotNewsPosts } from "@/lib/home";
import { getPostHref } from "@/lib/post-urls";

export function BreakingNewsBar() {
  const [lead, ...rest] = getHotNewsPosts(3);
  if (!lead) return null;

  return (
    <section className="border-b border-slate-200 bg-slate-50" aria-label="Son dakika">
      <div className="mx-auto max-w-portal px-4 py-2.5 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 border-l-2 border-gold pl-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
            Son Dakika
          </span>
          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-0">
            <Link
              href={getPostHref(lead)}
              className="block text-sm font-medium leading-snug text-navy transition hover:text-gold line-clamp-2 sm:line-clamp-1"
            >
              {lead.title}
            </Link>
            {rest.length > 0 ? (
              <div className="hidden gap-4 sm:flex">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={getPostHref(post)}
                    className="min-w-0 flex-1 text-[13px] leading-snug text-ink-muted transition hover:text-gold line-clamp-1"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
