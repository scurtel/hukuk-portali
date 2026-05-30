import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import {
  buildFaqPageSchema,
  buildPlatformAboutPageSchemaGraph,
  PLATFORM_ABOUT_FAQ
} from "@/lib/seo/platform";
import { getSiteUrl, siteConfig } from "@/lib/site";

const pageUrl = `${getSiteUrl()}/hakkimizda`;

export const metadata: Metadata = {
  title: "Hakkımızda | Hukuk, Yapay Zekâ ve Dijital Dönüşüm",
  description:
    "Hukukportali.com; hukuk profesyonellerine yapay zekâ ve dijital dönüşüm odaklı bilgi sunan, hukuk haberleri yayımlayan bağımsız bir dijital yayın ve teknoloji platformudur.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Hakkımızda | Hukuk Portalı",
    description: siteConfig.description,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website"
  }
};

const aboutSchemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": buildPlatformAboutPageSchemaGraph()
});

const faqSchemaJson = JSON.stringify(buildFaqPageSchema(PLATFORM_ABOUT_FAQ));

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-10">
      <article className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 via-white to-white p-5 shadow-sm sm:p-8">
        <header className="border-b border-blue-100 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{siteConfig.tagline}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">Hakkımızda</h1>
        </header>

        <div className="mt-8 space-y-10 text-sm leading-relaxed text-slate-700 sm:text-base">
          <section aria-labelledby="h-platform">
            <h2 id="h-platform" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Hukukportali.com Nedir?
            </h2>
            <p className="mt-3">
              Hukukportali.com, hukuk ile yapay zekâyı bir araya getiren bağımsız bir dijital yayın ve teknoloji
              platformudur. Avukatlar, hukuk büroları ve hukuk alanında çalışan profesyonellere; yapay zekâ destekli
              içerik, analiz, doküman, otomasyon ve dijital dönüşüm çözümleri hakkında güncel ve anlaşılır bilgi sunmayı
              amaçlar.
            </p>
            <p className="mt-3">
              Platform aynı zamanda hukuk gündemi, mevzuat gelişmeleri, yargı kararları, teknoloji, yapay zekâ ve hukuk
              haberleri yayımlar. İçerikler; mevzuat değişiklikleri ve uygulamada sık karşılaşılan sorunlar dikkate
              alınarak hazırlanır.
            </p>
            <p className="mt-3">
              <strong className="font-semibold text-slate-900">Hukukportali.com bir hukuk bürosunun reklam sitesi değildir.</strong>{" "}
              Kişisel avukatlık tanıtımı veya bireysel hukuki danışmanlık hizmeti sunmaz. Sitedeki tüm içerikler genel
              bilgilendirme amaçlıdır; somut dosyalar için doğrudan hukuki danışmanlık yerine geçmez.
            </p>
          </section>

          <section aria-labelledby="h-focus">
            <h2 id="h-focus" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Odak Alanlarımız
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Hukuk profesyonelleri için yapay zekâ araçları ve uygulama rehberleri</li>
              <li>Hukuk büroları için dijital dönüşüm ve otomasyon</li>
              <li>Mevzuat, yargı kararları ve hukuk teknolojisi gündemi</li>
              <li>Hukuk haberleri ve derinlemesine analizler</li>
            </ul>
          </section>

          <section aria-labelledby="h-faq" className="border-t border-slate-200 pt-10">
            <h2 id="h-faq" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Sıkça Sorulan Sorular
            </h2>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Aşağıdaki yanıtlar genel bilgilendirme amaçlıdır; kesin hukuki sonuç için dosyanız uzmanlarca
              değerlendirilmelidir.
            </p>
            <div className="mt-6 space-y-8">
              {PLATFORM_ABOUT_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed sm:text-base">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutSchemaJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaJson }} />
    </Container>
  );
}
