import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="border-b bg-slate-50 py-10 sm:py-12">
      <Container>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{siteConfig.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">{siteConfig.description}</p>
      </Container>
    </section>
  );
}
