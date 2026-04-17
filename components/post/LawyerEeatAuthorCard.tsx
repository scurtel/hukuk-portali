import Link from "next/link";
import Image from "next/image";

import { ConsultationCtaLink } from "@/components/ui/ConsultationCtaLink";
import { CEREN_OFFICIAL_SITE, CEREN_SAME_AS, PRIMARY_AUTHOR_SLUG } from "@/lib/seo/cerenLawyer";
import { cn } from "@/lib/utils";
import type { Author } from "@/types/author";

type LawyerEeatAuthorCardProps = {
  author: Author;
  className?: string;
};

function labelForSameAs(url: string): string {
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("google.com/maps")) return "Google Haritalar";
  return "Bağlantı";
}

export function LawyerEeatAuthorCard({ author, className }: LawyerEeatAuthorCardProps) {
  const site = author.officialWebsite ?? CEREN_OFFICIAL_SITE;
  const showSocial = author.slug === PRIMARY_AUTHOR_SLUG;

  return (
    <aside
      className={cn(
        "rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6",
        className
      )}
      aria-labelledby="lawyer-eeat-heading"
    >
      <p id="lawyer-eeat-heading" className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        Yazar ve avukat profili (E-E-A-T)
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src="/images/avukat-ceren-sumer-cilli.webp"
          alt="Avukat Ceren Sümer Cilli"
          width={96}
          height={96}
          className="h-24 w-24 flex-none rounded-full border border-slate-200 object-cover"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              <Link href={`/yazar/${author.slug}`} className="hover:text-brand-700 hover:underline">
                {author.name}
              </Link>
            </p>
            <p className="text-sm font-medium text-slate-600">{author.title}</p>
          </div>
          {author.expertise && author.expertise.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Uzmanlık alanları</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {author.expertise.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-900"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-sm leading-relaxed text-slate-700">{author.bio}</p>
          {showSocial ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resmî profil ve kaynaklar</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <li>
                  <a
                    href={CEREN_OFFICIAL_SITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    Resmî web sitesi
                  </a>
                </li>
                {CEREN_SAME_AS.filter((u) => u !== CEREN_OFFICIAL_SITE).map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline-offset-2 hover:underline">
                      {labelForSameAs(url)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <ConsultationCtaLink href={site}>Hukuki Danışmanlık Al</ConsultationCtaLink>
            <Link
              href={`/yazar/${author.slug}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Tüm yazılar
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
