import type { Author } from "@/types/author";

export const authors: Author[] = [
  {
    id: "a1",
    slug: "av-ceren-sumer-cilli",
    name: "Avukat Ceren Sümer Cilli",
    title: "Kıdemli Hukuk Editörü",
    bio: "Hukukportali.com için güncel mevzuat, içtihat ve uygulama odaklı içerikler üretir.",
    avatar: "/images/placeholder-author.jpg"
  }
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}
