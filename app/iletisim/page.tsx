import { Container } from "@/components/layout/Container";

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">İletişim</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Hukuk Portalı üzerindeki içerikler, güncel mevzuat analizleri ve yayınlarımız hakkında
          soru veya görüşlerinizi iletmek için aşağıdaki kanalları kullanabilirsiniz.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">E-posta</h2>
            <a
              href="mailto:info@hukukportali.com"
              className="mt-2 inline-flex min-h-11 items-center text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              info@hukukportali.com
            </a>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.82 19.82 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.07 12.8 19.82 19.82 0 0 1 2 4.09 2 2 0 0 1 4 1.91h3.09a2 2 0 0 1 2 1.72c.12.9.33 1.78.64 2.62a2 2 0 0 1-.45 2.11L8 9.99a16 16 0 0 0 6.01 6.01l1.63-1.28a2 2 0 0 1 2.11-.45c.84.31 1.72.52 2.62.64A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Telefon</h2>
            <a
              href="tel:+905411411989"
              className="mt-2 inline-flex min-h-11 items-center text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              0 (541) 141 19 89
            </a>
          </article>
        </div>

        <aside className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <strong className="text-slate-900">Yasal Uyarı:</strong> Bu platformda paylaşılan
          bilgiler sadece genel bilgilendirme amaçlıdır. Türkiye Barolar Birliği&apos;nin Reklam
          Yasağı Yönetmeliği uyarınca, bu sayfada yer alan iletişim bilgileri üzerinden kurulan
          temaslar doğrudan bir avukat-müvekkil ilişkisi tesis etmez. Hukuki uyuşmazlıklarınız için
          profesyonel bir hukuki yardım almanız önerilir.
        </aside>
      </div>
    </Container>
  );
}
