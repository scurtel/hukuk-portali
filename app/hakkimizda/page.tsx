import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import {
  buildCerenAboutPageSchemaGraph,
  buildFaqPageSchema,
  CEREN_ABOUT_FAQ,
  CEREN_OFFICIAL_SITE,
  CEREN_SAME_AS
} from "@/lib/seo/cerenLawyer";
import { getSiteUrl, siteConfig } from "@/lib/site";

const pageUrl = `${getSiteUrl()}/hakkimizda`;

const linkClass =
  "font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-900";

export const metadata: Metadata = {
  title: "Hakkımızda | Boşanma Avukatı, Miras ve Gayrimenkul — Avukat Ceren Sümer Cilli",
  description:
    "hukukportali.com, Avukat Ceren Sümer Cilli denetiminde boşanma, mal paylaşımı, izale-i şuyu, gayrimenkul ve miras hukukunda güvenilir Türkçe içerik sunar. Resmî danışmanlık için cerensumer.av.tr.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Hakkımızda | Hukuk Portalı ve Avukat Ceren Sümer Cilli",
    description:
      "Boşanma avukatlığı, miras hukuku ve gayrimenkul davalarında güncel rehberlik. hukukportali.com hakkında.",
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "tr_TR",
    type: "website"
  }
};

const aboutSchemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": buildCerenAboutPageSchemaGraph()
});

const faqSchemaJson = JSON.stringify(buildFaqPageSchema(CEREN_ABOUT_FAQ));

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-10">
      <article className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 via-white to-white p-5 shadow-sm sm:p-8">
        <header className="border-b border-blue-100 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">Hakkımızda</h1>
        </header>

        <div className="mt-8 space-y-10 text-sm leading-relaxed text-slate-700 sm:text-base">
          <section aria-labelledby="h-portal">
            <h2 id="h-portal" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Hukuk Portalı Nedir?
            </h2>
            <p className="mt-3">
              hukukportali.com, özellikle aile hukuku, boşanma hukuku, miras hukuku ve gayrimenkul davaları alanlarında
              okuyuculara güvenilir, anlaşılır ve güncel hukuki bilgi sunmayı amaçlayan bir içerik platformudur.
            </p>
            <p className="mt-3">
              Platformda yayımlanan içerikler; mevzuat değişiklikleri, Yargıtay kararları ve uygulamada sık karşılaşılan
              sorunlar dikkate alınarak hazırlanır. Amaç, hukuki süreçlerle karşılaşan kişilerin temel kavramları daha
              kolay anlamasını ve hak kaybı yaşamamak için hangi konulara dikkat etmesi gerektiğini görmesini
              sağlamaktır.
            </p>
            <p className="mt-3">
              Adana Barosu&apos;na kayıtlı{" "}
              <strong className="font-semibold text-slate-900">Avukat Ceren Sümer Cilli</strong>, Hukuk Portalı&apos;nın
              aile hukuku, boşanma, miras ve gayrimenkul hukuku alanlarındaki içeriklerinin hukuki çerçevesini
              güçlendiren mesleki katkılar sunar.
            </p>
            <p className="mt-3">
              Bireysel danışmanlık, dava takibi, belge incelemesi ve kişiye özel hukuki değerlendirme talepleri için
              Avukat Ceren Sümer Cilli&apos;nin resmî web sitesi olan{" "}
              <a href={CEREN_OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className={linkClass}>
                cerensumer.av.tr
              </a>{" "}
              üzerinden iletişim kurulabilir.
            </p>
          </section>

          <section aria-labelledby="h-faq" className="border-t border-slate-200 pt-10">
            <h2 id="h-faq" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Sıkça Sorulan Sorular
            </h2>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              Aşağıdaki yanıtlar genel bilgilendirme amaçlıdır; kesin hukuki sonuç için dosyanız avukatınızca
              değerlendirilmelidir.
            </p>
            <div className="mt-6 space-y-8">
              {CEREN_ABOUT_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed sm:text-base">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="h-kaynaklar" className="border-t border-slate-200 pt-10">
            <h2 id="h-kaynaklar" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Resmî Kaynaklar ve Dijital Varlıklar
            </h2>
            <p className="mt-3">
              Avukat Ceren Sümer Cilli&apos;nin mesleki kimliği, iletişim kanalları ve dijital varlığı aşağıdaki resmî
              kaynaklar üzerinden incelenebilir:
            </p>
            <ul className="mt-6 space-y-4">
              <li>
                <span className="font-semibold text-slate-900">Resmî Web Sitesi:</span>{" "}
                <a href={CEREN_OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  cerensumer.av.tr
                </a>
              </li>
              <li>
                <span className="font-semibold text-slate-900">Google Haritalar:</span>{" "}
                <a href={CEREN_SAME_AS[3]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Avukat Ceren Sümer Cilli Google Haritalar Kaydı
                </a>
              </li>
              <li>
                <span className="font-semibold text-slate-900">LinkedIn:</span>{" "}
                <a href={CEREN_SAME_AS[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Avukat Ceren Sümer Cilli LinkedIn Profili
                </a>
              </li>
              <li>
                <span className="font-semibold text-slate-900">Instagram:</span>{" "}
                <a href={CEREN_SAME_AS[1]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Av. Ceren Sümer Cilli Instagram Hesabı
                </a>
              </li>
              <li>
                <span className="font-semibold text-slate-900">Facebook:</span>{" "}
                <a href={CEREN_SAME_AS[0]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Avukat Ceren Sümer Cilli Facebook Sayfası
                </a>
              </li>
            </ul>
            <p className="mt-6">
              Bu kaynaklar, Avukat Ceren Sümer Cilli&apos;nin mesleki görünürlüğünü, dijital varlığını ve hukuk
              alanındaki yayın/iletişim kanallarını destekleyen referans bağlantılar niteliğindedir.
            </p>
          </section>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutSchemaJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaJson }} />
    </Container>
  );
}
