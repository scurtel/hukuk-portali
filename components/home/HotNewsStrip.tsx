import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { getHotNewsPosts } from "@/lib/home";
import { getPostHref } from "@/lib/post-urls";

export function HotNewsStrip() {
  const items = getHotNewsPosts(8);

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-3" aria-label="Sıcak gündem">
      <Container wide>
        <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-thin">
          <span className="flex shrink-0 items-center self-center rounded-sm bg-accent-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs">
            Sıcak Gündem
          </span>
          {items.map((post) => (
            <Link
              key={post.id}
              href={getPostHref(post)}
              className="flex min-w-[200px] max-w-[280px] shrink-0 flex-col justify-center border-l border-slate-200 pl-3 first:border-l-0 sm:min-w-[240px]"
            >
              <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition hover:text-brand-500">
                {post.title}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
