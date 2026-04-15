import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="border-b bg-slate-50 py-12">
      <Container>
        <h1 className="text-4xl font-bold text-slate-900">{siteConfig.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-700">{siteConfig.description}</p>
      </Container>
    </section>
  );
}
