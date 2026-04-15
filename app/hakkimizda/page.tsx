import { Container } from "@/components/layout/Container";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Avukat Ceren Sümer Cilli",
  jobTitle: "Attorney at Law",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adana",
    addressCountry: "Turkey"
  },
  knowsAbout: ["Family Law", "Inheritance Law", "Divorce Mediation"],
  worksFor: {
    "@type": "Organization",
    name: "Hukuk Portalı"
  }
};

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-10">
      <article className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 via-white to-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">
          Hukukta Güvenilir Rehberlik: Hukuk Portalı
        </h1>

        <div className="mt-6 space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Hukukta Güvenilir Rehberlik: Hukuk Portalı
            </h2>
            <p className="mt-3">
              hukukportali.com, aile hukuku ve miras süreçleri gibi hayatın en kritik dönemlerinde
              doğru, güncel ve anlaşılır bilgiye erişimi sağlamak amacıyla kurulmuş profesyonel bir
              içerik platformudur. Tüm yayın süreçlerimiz ve hukuki analizlerimiz, Avukat Ceren Sümer
              Cilli&apos;nin uzmanlığı ve denetimiyle şekillenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Vizyonumuz ve Uzmanlık Alanlarımız
            </h2>
            <p className="mt-3">
              Hukuk dünyasındaki dinamik değişimleri, özellikle 2026 yılındaki yeni içtihatları ve
              Yargıtay kararlarını yakından takip ederek, karmaşık yasal süreçleri herkes için şeffaf
              hale getiriyoruz. Platformumuz, teknik bilginin ötesinde, hukuki sorunların insani
              boyutunu da önemseyen bir yaklaşımı benimser.
            </p>

            <h3 className="mt-6 text-lg font-semibold tracking-tight text-blue-900 sm:text-xl">
              Temel Uzmanlık Odaklarımız
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  ✓
                </span>
                <p>
                  <strong>Aile Hukuku ve Boşanma Davaları:</strong> Çekişmeli/anlaşmalı boşanma
                  yönetimi, velayet ve nafaka uyuşmazlıkları.
                </p>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  ✓
                </span>
                <p>
                  <strong>Mal Paylaşımı ve Miras:</strong> Mal rejiminin tasfiyesi, miras paylaşımları
                  ve vasiyetname düzenlemeleri.
                </p>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  ✓
                </span>
                <p>
                  <strong>Ortaklığın Giderilmesi (İzale-i Şuyu):</strong> Taşınmaz mallar üzerindeki
                  ortaklığın hukuki çözümü.
                </p>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  ✓
                </span>
                <p>
                  <strong>Boşanma Arabuluculuğu:</strong> Mahkeme öncesi profesyonel rehberlik ve
                  uzlaşma yönetimi.
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">
              Avukat Ceren Sümer Cilli Hakkında
            </h2>
            <p className="mt-3">
              Adana Barosu&apos;na kayıtlı olarak avukatlık mesleğini sürdüren Ceren Sümer Cilli,
              özellikle aile ve miras hukuku alanındaki derin tecrübesiyle tanınmaktadır. Akademik
              bilgi birikimini pratik saha tecrübesiyle birleştiren Ceren Sümer Cilli, Adana Boşanma
              Davaları ve Adana Miras Hukuku konularında bölgedeki hukuki süreçlere rehberlik
              etmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl">Neden Hukuk Portalı?</h2>
            <p className="mt-3">
              İçeriklerimiz, Yargıtay 2. Hukuk Dairesi gibi yüksek mahkemelerin en güncel kararları
              ışığında titizlikle hazırlanır. Amacımız; mülkiyet haklarından aile içi huzurun
              korunmasına kadar her konuda güvenilir, tarafsız ve otoriter bilgi kaynağı olmaktır.
            </p>
          </section>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </Container>
  );
}
