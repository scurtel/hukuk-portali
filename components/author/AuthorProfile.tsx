import type { Author } from "@/types/author";

type AuthorProfileProps = {
  author: Author;
};

export function AuthorProfile({ author }: AuthorProfileProps) {
  return (
    <header className="mb-6 space-y-2">
      <h1 className="text-3xl font-bold text-slate-900">{author.name}</h1>
      <p className="text-slate-600">{author.title}</p>
      <p className="text-slate-700">{author.bio}</p>
    </header>
  );
}
