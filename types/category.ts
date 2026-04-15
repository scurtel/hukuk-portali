export type CategoryType = "haber" | "rehber" | "analiz";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: CategoryType;
};
