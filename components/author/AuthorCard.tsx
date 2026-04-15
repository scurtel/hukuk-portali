import Link from "next/link";

import type { Author } from "@/types/author";

type AuthorCardProps = {
  author: Author;
};

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4">
      <h3 className="text-lg font-semibold">
        <Link href={`/yazar/${author.slug}`}>{author.name}</Link>
      </h3>
      <p className="text-sm text-slate-500">{author.title}</p>
      <p className="mt-2 text-sm text-slate-700">{author.bio}</p>
    </article>
  );
}
