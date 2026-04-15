import type { Category } from "@/types/category";

type CategoryHeaderProps = {
  category: Category;
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{category.name}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">{category.description}</p>
    </header>
  );
}
