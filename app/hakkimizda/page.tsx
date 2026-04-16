import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import {
  buildCerenAboutPageSchemaGraph,
  buildFaqPageSchema,
  CEREN_ABOUT_FAQ,
  CEREN_OFFICIAL_SITE
} from "@/lib/seo/cerenLawyer";
import { siteConfig } from "@/lib/site";

const pageUrl = `${siteConfig.url}/hakkimizda`;

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
          <h1 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">
            Hukuk Portalı ve Avukat Ceren Sümer Cilli: Boşanma Avukatı, Miras Hukuku Uzmanlığı ve Gayrimenkul Davalarında
            Rehberlik
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            hukukportali.com; anlaşmalı ve çekişmeli boşanma, mal paylaşımı, ortaklığın giderilmesi (izale-i şuyu),
            gayrimenkul ve miras hukuku başlıklarında güncel, anlaşılır ve kaynak odaklı içerik üretir. Yayın çizgisi,
            Avukat Ceren Sümer Cilli&apos;nin mesleki deneyimi ve editoryal denetimiyle şekillenir. Somut dosya ve
            strateji için kişiye özel değerlendirme yalnızca avukatlık hizmeti kapsamındadır.
          </p>
        </header>

        <div className="mt-8 space-y-10 text-sm leading-relaxed text-slate-700 sm:text-base">
          <section aria-labelledby="h-bosanma">
            <h2 id="h-bosanma" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Boşanma Avukatı: Anlaşmalı ve Çekişmeli Süreçlere Profesyonel Çerçeve
            </h2>
            <p className="mt-3">
              Aile hukuku uyuşmazlıklarında doğru bilgi, süre yönetimi ve hakların korunması açısından kritiktir.
              Platformumuz; protokol, delil, nafaka ve velayet gibi başlıklarda okuyucuya yön veren özetler sunar.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-blue-900 sm:text-xl">
              Anlaşmalı boşanma ve çekişmeli boşanma odaklı içerikler
            </h3>
            <p className="mt-3">
              Anlaşmalı boşanmada tarafların iradesi ve düzenlenecek metinler; çekişmeli boşanmada ise ispat ve süreç
              yönetimi öne çıkar. Her iki yolda da mahkeme takvimi ve dosyanın özellikleri sonucu doğrudan etkiler.
            </p>
          </section>

          <section aria-labelledby="h-miras">
            <h2 id="h-miras" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Miras Hukuku Uzmanı: Paylar, Mirasçılık ve Mal Varlığı Planlamasına Dair Genel Bilgilendirme
            </h2>
            <p className="mt-3">
              Mirasın açılması, mirasçılık belgesi, vasiyetname ve tereke ile ilgili güncel uygulamalar; paylaşım ve
              tescil aşamalarında sık karşılaşılan sorulara ışık tutacak şekilde ele alınır.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-blue-900 sm:text-xl">
              Mal paylaşımı ve miras uyuşmazlıkları
            </h3>
            <p className="mt-3">
              Mal rejimi, tereke unsurları ve mirasın reddi gibi konularda içeriklerimiz genel çerçeveyi açıklar; birebir
              hesaplama ve dava stratejisi için avukatlık görüşü gerekebilir.
            </p>
          </section>

          <section aria-labelledby="h-gayrimenkul">
            <h2 id="h-gayrimenkul" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Gayrimenkul Davaları ve İzale-i Şuyu: Ortaklığın Giderilmesi Başlığında Rehber İçerikler
            </h2>
            <p className="mt-3">
              Paylı mülkiyet, sınır ihtilafı ve ortaklığın giderilmesi (izale-i şuyu) gibi gayrimenkul kaynaklı
              uyuşmazlıklarda süreç adımları ve sık yapılan hatalar, içtihat ışığında sade bir dille işlenir.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-blue-900 sm:text-xl">
              Taşınmaz ve ortaklık hukuku pratikleri
            </h3>
            <p className="mt-3">
              Tapu kayıtları, pay oranları ve satış/ünite seçimi gibi unsurlar dava türünü ve riskleri belirler. Bu
              nedenle içeriklerimiz bilgilendiricidir; somut tapu ve sözleşme incelemesi avukatlık hizmeti ile yapılmalıdır.
            </p>
          </section>

          <section aria-labelledby="h-portal">
            <h2 id="h-portal" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Hukuk Portalı nedir?
            </h2>
            <p className="mt-3">
              hukukportali.com, özellikle aile ve miras alanlarında yaşanan stresi azaltmak için tasarlanmış bir içerik
              platformudur. Yargıtay kararları ve mevzuat güncellemeleri takip edilir; okuyucuya tarafsız ve erişilebilir
              özetler sunulur.
            </p>
            <p className="mt-3">
              Adana Barosu kayıtlı{" "}
              <strong className="font-semibold text-slate-900">Avukat Ceren Sümer Cilli</strong>, içeriklerin hukuki
              çerçevesini ve güvenilirliğini güçlendirir. Kişisel verileriniz ve dosya mahremiyeti için doğrudan resmî
              iletişim kanallarını kullanmanızı öneririz. Bireysel danışmanlık ve dava temsili talepleri için resmî web
              sitesi:{" "}
              <a
                href={CEREN_OFFICIAL_SITE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-900"
              >
                cerensumer.av.tr
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="h-faq" className="border-t border-slate-200 pt-10">
            <h2 id="h-faq" className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Sıkça sorulan sorular
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
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutSchemaJson }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaJson }} />
    </Container>
  );
}
