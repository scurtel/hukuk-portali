import type { Category } from "@/types/category";

type CategoryHeaderProps = {
  category: Category;
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <header className="mb-8 border-b-2 border-navy pb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gold">Kategori</p>
      <h1 className="mt-1 font-serif text-3xl font-bold text-navy sm:text-4xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{category.description}</p>
    </header>
  );
}
