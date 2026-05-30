import Link from "next/link";

import { cn } from "@/lib/utils";

type ArticlePlatformCtaProps = {
  className?: string;
};

export function ArticlePlatformCta({ className }: ArticlePlatformCtaProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-5 sm:p-6",
        className
      )}
      aria-label="Platform önerileri"
    >
      <p className="text-sm font-semibold text-blue-900 sm:text-base">Hukukportali.com</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
        Hukuk profesyonelleri için yapay zekâ, dijital dönüşüm ve güncel hukuk haberleri. Aşağıdaki
        bölümleri keşfedebilirsiniz.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/kategori/rehber"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
        >
          Hukukta Yapay Zekâ İçeriklerini Keşfet
        </Link>
        <Link
          href="/kategori/haber"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-brand-200 hover:text-brand-800"
        >
          Hukuk Haberlerini Oku
        </Link>
      </div>
    </aside>
  );
}
