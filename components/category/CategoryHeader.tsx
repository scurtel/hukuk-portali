import type { Category } from "@/types/category";

type CategoryHeaderProps = {
  category: Category;
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
      <p className="mt-2 text-slate-700">{category.description}</p>
    </header>
  );
}
