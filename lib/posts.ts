import type { Post } from "@/types/post";
import { generatedPostContents } from "@/lib/generatedPostContents";

export const posts: Post[] = [
  {
    id: "p1",
    slug: "anayasa-mahkemesi-yeni-karar",
    title: "Anayasa Mahkemesi'nden Bireysel Başvuruya İlişkin Yeni Karar",
    excerpt: "Mahkemenin son kararı, ifade özgürlüğü başvurularında yeni bir yaklaşım sunuyor.",
    content: generatedPostContents["anayasa-mahkemesi-yeni-karar"],
    type: "haber",
    categorySlug: "haber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-10",
    featured: true
  },
  {
    id: "p2",
    slug: "is-kanunu-degisiklik-taslagi",
    title: "İş Kanunu Değişiklik Taslağı Kamuoyuna Sunuldu",
    excerpt: "Taslak metin, fazla mesai ve uzaktan çalışma maddelerinde önemli yenilikler içeriyor.",
    content: generatedPostContents["is-kanunu-degisiklik-taslagi"],
    type: "haber",
    categorySlug: "haber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-08"
  },
  {
    id: "p3",
    slug: "kvkk-ceza-uygulamalari-2026",
    title: "KVKK Ceza Uygulamalarında 2026 İlk Çeyrek Verileri",
    excerpt: "Kurul kararlarında veri güvenliği ihlalleri öne çıkıyor.",
    content: generatedPostContents["kvkk-ceza-uygulamalari-2026"],
    type: "haber",
    categorySlug: "haber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-05"
  },
  {
    id: "p4",
    slug: "iscilik-alacagi-davasi-nasil-acilir",
    title: "İşçilik Alacağı Davası Nasıl Açılır? Adım Adım Rehber",
    excerpt: "Dava öncesi arabuluculuk, dilekçe hazırlığı ve delil listesi sürecini özetliyoruz.",
    content: generatedPostContents["iscilik-alacagi-davasi-nasil-acilir"],
    type: "rehber",
    categorySlug: "rehber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-03",
    featured: true
  },
  {
    id: "p5",
    slug: "tutuklamaya-itiraz-sureci",
    title: "Tutuklamaya İtiraz Süreci: Haklar ve Süreler",
    excerpt: "Ceza yargılamasında itiraz mekanizması ve pratik uygulama notları.",
    content: generatedPostContents["tutuklamaya-itiraz-sureci"],
    type: "rehber",
    categorySlug: "rehber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-01"
  },
  {
    id: "p6",
    slug: "kvkk-ihlali-bildirimi-rehberi",
    title: "KVKK İhlal Bildirimi Rehberi",
    excerpt: "İhlal tespiti sonrası yapılacak bildirimin kapsamı ve teknik hazırlık listesi.",
    content: generatedPostContents["kvkk-ihlali-bildirimi-rehberi"],
    type: "rehber",
    categorySlug: "rehber",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-03-29"
  },
  {
    id: "p7",
    slug: "ifade-ozgurlugu-karar-analizi",
    title: "İfade Özgürlüğü Karar Analizi: Ölçülülük Testi",
    excerpt: "Yeni kararda uygulanan ölçülülük testi önceki içtihatla karşılaştırılıyor.",
    content: generatedPostContents["ifade-ozgurlugu-karar-analizi"],
    type: "analiz",
    categorySlug: "analiz",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-03-27",
    featured: true
  },
  {
    id: "p8",
    slug: "uzaktan-calisma-sozlesmeleri-analizi",
    title: "Uzaktan Çalışma Sözleşmelerinde Güncel Riskler",
    excerpt: "Taslak düzenleme ışığında işveren ve çalışan açısından kritik noktalar.",
    content: generatedPostContents["uzaktan-calisma-sozlesmeleri-analizi"],
    type: "analiz",
    categorySlug: "analiz",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-03-24"
  },
  {
    id: "p9",
    slug: "acik-riza-metni-yeterlilik-analizi",
    title: "Açık Rıza Metinlerinde Yeterlilik Sorunu",
    excerpt: "Kurul kararları kapsamında açık rızanın geçerlilik kriterleri ele alınıyor.",
    content: generatedPostContents["acik-riza-metni-yeterlilik-analizi"],
    type: "analiz",
    categorySlug: "analiz",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-03-21"
  },
  {
    id: "p10",
    slug: "yapay-zeka-avukat-sorumlulugu",
    title: "Algoritmanın Hatası, Avukatın Sorumluluğu: ABD’den Dikkat Çeken Karar",
    excerpt:
      "ABD’deki emsal karar, yapay zekâ destekli dilekçelerde doğrulama zorunluluğunu ve avukatın mesleki özen yükümlülüğünü yeniden gündeme taşıyor.",
    content: generatedPostContents["yapay-zeka-avukat-sorumlulugu"],
    type: "analiz",
    categorySlug: "analiz",
    authorSlug: "av-ceren-sumer-cilli",
    publishedAt: "2026-04-16",
    featured: true
  }
];

export function getPostBySlug(slug: string, type?: Post["type"]): Post | undefined {
  return posts.find((post) => post.slug === slug && (!type || post.type === type));
}

export function getPostsByType(type: Post["type"]): Post[] {
  return posts.filter((post) => post.type === type);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((post) => post.featured);
}

export function getPostsByCategory(slug: string): Post[] {
  return posts.filter((post) => post.categorySlug === slug);
}

export function getPostsByAuthor(slug: string): Post[] {
  return posts.filter((post) => post.authorSlug === slug);
}
