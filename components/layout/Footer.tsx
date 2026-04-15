import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-slate-50">
      <Container className="space-y-2 py-6 text-sm text-slate-600">
        <p>
          {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
        </p>
        <p>Hukuk alanında güncel, güvenilir ve anlaşılır Türkçe içerikler sunar.</p>
      </Container>
    </footer>
  );
}
