"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { CategoryBadge } from "@/components/post/CategoryBadge";
import { formatPostDate } from "@/lib/post-display";
import { searchIndex, type SearchIndexEntry } from "@/lib/search-index";

type SiteSearchProps = {
  index: SearchIndexEntry[];
  initialQuery?: string;
};

export function SiteSearch({ index, initialQuery = "" }: SiteSearchProps) {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery || urlQ);

  const results = useMemo(() => searchIndex(query, index), [query, index]);

  return (
    <div>
      <form
        role="search"
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Site içinde ara
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Haber, rehber veya analiz ara…"
          className="min-h-12 flex-1 rounded-sm border border-slate-300 bg-white px-4 text-base text-ink shadow-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          autoComplete="off"
        />
      </form>

      <p className="mt-4 text-sm text-ink-subtle">
        {query.trim() ? (
          <>
            <span className="font-semibold text-ink">{results.length}</span> sonuç bulundu
          </>
        ) : (
          "Anahtar kelime girerek içeriklerde arama yapabilirsiniz."
        )}
      </p>

      <ul className="mt-6 space-y-4">
        {results.map((item) => (
          <SearchResultItem key={item.id} item={item} />
        ))}
      </ul>

      {query.trim() && results.length === 0 ? (
        <p className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-ink-muted">
          Eşleşen içerik bulunamadı. Farklı anahtar kelimeler deneyin veya{" "}
          <Link href="/kategori/haber" className="font-semibold text-navy active:text-gold">
            haberler
          </Link>{" "}
          bölümüne göz atın.
        </p>
      ) : null}
    </div>
  );
}

function SearchResultItem({ item }: { item: SearchIndexEntry }) {
  return (
    <li className="rounded-sm border border-slate-200 bg-white p-4 shadow-card transition hover:shadow-card-hover">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <CategoryBadge slug={item.categorySlug} />
        <time dateTime={item.publishedAt} className="text-xs text-ink-subtle">
          {formatPostDate(item.publishedAt)}
        </time>
      </div>
      <h2 className="font-serif text-lg font-bold text-ink">
        <Link href={item.href} className="active:text-gold">
          {item.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{item.excerpt}</p>
    </li>
  );
}
