import type { Post } from "@/types/post";
import { generatedPostContents } from "@/lib/generatedPostContents";
import { PRIMARY_AUTHOR_SLUG } from "@/lib/seo/cerenLawyer";
import type { Author } from "@/types/author";
import type { Category } from "@/types/category";

export { getPostHref } from "@/lib/post-urls";

export const staticAuthors: Author[] = [
  {
    id: "author-ceren",
    slug: PRIMARY_AUTHOR_SLUG,
    name: "Avukat Ceren Sumer Cilli",
    title: "Aile, Miras ve Gayrimenkul Hukuku Avukatı — Hukuk Portalı editörlüğü",
    bio: "Hukuk Portalı içeriklerinin hukuki çerçevesini ve güncelliğini yönlendirir.",
    avatar: "/images/placeholder-author.jpg"
  }
];

export const staticCategories: Category[] = [
  {
    id: "category-haber",
    slug: "haber",
    name: "Haberler",
    description: "Güncel hukuk haberleri",
    type: "haber"
  },
  {
    id: "category-rehber",
    slug: "rehber",
    name: "Rehberler",
    description: "Uygulamaya yönelik rehber içerikler",
    type: "rehber"
  },
  {
    id: "category-analiz",
    slug: "analiz",
    name: "Analizler",
    description: "Derinlemesine hukuki analizler",
    type: "analiz"
  }
];

const postMetas = [
  {
    id: "post-1",
    slug: "anayasa-mahkemesi-yeni-karar",
    title: "Anayasa Mahkemesi'nden Bireysel Başvuruya İlişkin Yeni Karar",
    excerpt: "Mahkemenin son kararı, ifade özgürlüğü başvurularında yeni bir yaklaşım sunuyor.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-03-05"
  },
  {
    id: "post-2",
    slug: "is-kanunu-degisiklik-taslagi",
    title: "İş Kanunu Değişiklik Taslağı Kamuoyuna Sunuldu",
    excerpt: "Taslak metin, fazla mesai ve uzaktan çalışma maddelerinde önemli yenilikler içeriyor.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-03-01"
  },
  {
    id: "post-3",
    slug: "kvkk-ceza-uygulamalari-2026",
    title: "KVKK Ceza Uygulamalarında 2026 İlk Çeyrek Verileri",
    excerpt: "Kurul kararlarında veri güvenliği ihlalleri öne çıkıyor.",
    type: "haber",
    categorySlug: "haber",
    featured: false,
    publishedAt: "2026-02-19"
  },
  {
    id: "post-4",
    slug: "iscilik-alacagi-davasi-nasil-acilir",
    title: "İşçilik Alacağı Davası Nasıl Açılır? Adım Adım Rehber",
    excerpt: "Dava öncesi arabuluculuk, dilekçe hazırlığı ve delil listesi sürecini özetliyoruz.",
    type: "rehber",
    categorySlug: "rehber",
    featured: true,
    publishedAt: "2026-02-11"
  },
  {
    id: "post-5",
    slug: "tutuklamaya-itiraz-sureci",
    title: "Tutuklamaya İtiraz Süreci: Haklar ve Süreler",
    excerpt: "Ceza yargılamasında itiraz mekanizması ve pratik uygulama notları.",
    type: "rehber",
    categorySlug: "rehber",
    featured: false,
    publishedAt: "2026-01-28"
  },
  {
    id: "post-6",
    slug: "kvkk-ihlali-bildirimi-rehberi",
    title: "KVKK İhlal Bildirimi Rehberi",
    excerpt: "İhlal tespiti sonrası yapılacak bildirimin kapsamı ve teknik hazırlık listesi.",
    type: "rehber",
    categorySlug: "rehber",
    featured: false,
    publishedAt: "2026-01-16"
  },
  {
    id: "post-7",
    slug: "ifade-ozgurlugu-karar-analizi",
    title: "İfade Özgürlüğü Karar Analizi: Ölçülülük Testi",
    excerpt: "Yeni kararda uygulanan ölçülülük testi önceki içtihatla karşılaştırılıyor.",
    type: "analiz",
    categorySlug: "analiz",
    featured: true,
    publishedAt: "2026-01-08"
  },
  {
    id: "post-8",
    slug: "uzaktan-calisma-sozlesmeleri-analizi",
    title: "Uzaktan Çalışma Sözleşmelerinde Güncel Riskler",
    excerpt: "Taslak düzenleme ışığında işveren ve çalışan açısından kritik noktalar.",
    type: "analiz",
    categorySlug: "analiz",
    featured: false,
    publishedAt: "2025-12-24"
  },
  {
    id: "post-9",
    slug: "acik-riza-metni-yeterlilik-analizi",
    title: "Açık Rıza Metinlerinde Yeterlilik Sorunu",
    excerpt: "Kurul kararları kapsamında açık rızanın geçerlilik kriterleri ele alınıyor.",
    type: "analiz",
    categorySlug: "analiz",
    featured: false,
    publishedAt: "2025-12-10"
  }
] as const;

export const staticPosts: Post[] = postMetas.map((meta) => ({
  ...meta,
  authorSlug: PRIMARY_AUTHOR_SLUG,
  content: generatedPostContents[meta.slug] ?? "Bu içerik yakında eklenecek.",
  imageUrl: null
}));

function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostBySlug(slug: string, type?: Post["type"]): Post | undefined {
  return staticPosts.find((post) => post.slug === slug && (!type || post.type === type));
}

export function getPostsByType(type: Post["type"], take?: number): Post[] {
  const posts = sortByDateDesc(staticPosts.filter((post) => post.type === type));
  return typeof take === "number" ? posts.slice(0, take) : posts;
}

export function getFeaturedPosts(): Post[] {
  return sortByDateDesc(staticPosts.filter((post) => post.featured));
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return sortByDateDesc(staticPosts.filter((post) => post.categorySlug === categorySlug));
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return sortByDateDesc(staticPosts.filter((post) => post.authorSlug === authorSlug));
}

/** Sitemap ve toplu işlemler için */
export function getAllPosts(): Post[] {
  return sortByDateDesc(staticPosts);
}
