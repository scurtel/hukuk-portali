import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function TopBar() {
  return (
    <div className="border-b border-brand-900/20 bg-brand-900 text-white">
      <Container wide className="flex min-h-9 items-center justify-between gap-3 py-1.5 text-xs sm:text-sm">
        <p className="truncate font-medium tracking-wide">
          Hukuk, Yapay Zekâ ve Dijital Dönüşüm Haberleri
        </p>
        <p className="hidden shrink-0 text-white/75 sm:block">{siteConfig.tagline}</p>
      </Container>
    </div>
  );
}
