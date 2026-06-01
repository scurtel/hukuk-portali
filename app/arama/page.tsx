import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/layout/Container";
import { SiteSearch } from "@/components/search/SiteSearch";
import { getSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Arama",
  description: "Hukuk Portalı içeriklerinde haber, rehber ve analiz arayın.",
  robots: { index: true, follow: true }
};

export default function SearchPage() {
  const index = getSearchIndex();

  return (
    <div className="portal-section">
      <Container wide className="py-4 sm:py-6">
        <header className="mb-8 border-b-2 border-brand-900 pb-4">
          <h1 className="font-serif text-3xl font-bold text-brand-900 sm:text-4xl">Arama</h1>
          <p className="mt-3 max-w-2xl text-sm text-ink-muted sm:text-base">
            Mevzuat, yapay zekâ, boşanma, tapu ve diğer başlıklarda yayımlanan içeriklerde arama yapın.
          </p>
        </header>
        <Suspense fallback={<p className="text-sm text-ink-muted">Arama yükleniyor…</p>}>
          <SiteSearch index={index} />
        </Suspense>
      </Container>
    </div>
  );
}
