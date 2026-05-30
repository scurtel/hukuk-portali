import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-slate-50">
      <Container className="space-y-2 py-6 text-sm text-slate-600">
        <p>
          {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
        </p>
        <p>{siteConfig.tagline}</p>
        <p className="text-xs text-slate-500">
          Bağımsız dijital yayın platformu; içerikler genel bilgilendirme amaçlıdır.
        </p>
      </Container>
    </footer>
  );
}
