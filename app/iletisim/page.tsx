import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">İletişim</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {siteConfig.name} editöryal ekibi; platform içerikleri, yapay zekâ ve hukuk teknolojisi haberleri ile
          iş birliği talepleri hakkında aşağıdaki kanaldan ulaşılabilir.
        </p>

        <div className="mt-8">
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
            <h2 className="text-lg font-semibold text-slate-900">Platform iletişimi</h2>
            <a
              href="mailto:info@hukukportali.com"
              className="mt-2 inline-flex min-h-11 items-center text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              info@hukukportali.com
            </a>
          </article>
        </div>

        <aside className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <strong className="text-slate-900">Yasal uyarı:</strong> Bu platformda paylaşılan bilgiler yalnızca genel
          bilgilendirme amaçlıdır. Hukukportali.com bir avukatlık bürosu veya hukuki danışmanlık hizmeti sunmaz;
          iletişim kurulması avukat-müvekkil ilişkisi doğurmaz. Somut uyuşmazlıklarınız için yetkili bir hukuk
          uzmanına başvurmanız önerilir.
        </aside>
      </div>
    </Container>
  );
}
