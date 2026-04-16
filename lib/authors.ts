import type { Author } from "@/types/author";

export const authors: Author[] = [
  {
    id: "a1",
    slug: "av-ceren-sumer-cilli",
    name: "Avukat Ceren Sümer Cilli",
    title: "Aile, Miras ve Gayrimenkul Hukuku Avukatı — Hukuk Portalı editörlüğü",
    bio: "Adana Barosu kayıtlı avukat olarak anlaşmalı ve çekişmeli boşanma, mal paylaşımı, izale-i şuyu, gayrimenkul ve miras uyuşmazlıklarında saha deneyimini akademik disiplinle birleştirir. hukukportali.com içeriklerinin hukuki çerçevesini ve güncelliğini yönlendirir; okuyucuya genel bilgilendirme sunar, somut dosya stratejisi için doğrudan avukata başvurulmasını önerir.",
    avatar: "/images/placeholder-author.jpg",
    officialWebsite: "https://cerensumer.av.tr",
    expertise: [
      "Anlaşmalı / çekişmeli boşanma",
      "Mal paylaşımı",
      "İzale-i şuyu",
      "Gayrimenkul hukuku",
      "Miras hukuku"
    ]
  }
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}
