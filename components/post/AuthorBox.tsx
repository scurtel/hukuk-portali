import Link from "next/link";

import { getAuthorBySlug } from "@/lib/authors";

type AuthorBoxProps = {
  authorSlug: string;
};

export function AuthorBox({ authorSlug }: AuthorBoxProps) {
  const author = getAuthorBySlug(authorSlug);

  if (!author) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <p className="text-sm text-slate-500">Yazar</p>
      <Link href={`/yazar/${author.slug}`} className="inline-flex min-h-11 items-center text-lg font-semibold hover:text-brand-700">
        {author.name}
      </Link>
      <p className="text-sm text-slate-600">{author.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{author.bio}</p>
    </div>
  );
}
