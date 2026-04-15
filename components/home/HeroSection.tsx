import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Güncel Hukuki İçerik Platformu</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              {siteConfig.description}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <Image
              src="https://source.unsplash.com/featured/?law,justice,courtroom&sig=hero"
              alt="Hukuk temalı profesyonel çalışma alanı"
              width={900}
              height={600}
              className="h-56 w-full object-cover sm:h-64 lg:h-72"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 to-transparent p-4 text-white">
              <p className="text-sm font-medium">Aile Hukuku, Miras ve Güncel İçtihat Analizleri</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
