import type { Author } from "@/types/author";

type AuthorProfileProps = {
  author: Author;
};

export function AuthorProfile({ author }: AuthorProfileProps) {
  return (
    <header className="mb-6 space-y-2">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{author.name}</h1>
      <p className="text-sm text-slate-600 sm:text-base">{author.title}</p>
      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{author.bio}</p>
    </header>
  );
}
