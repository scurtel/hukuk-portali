import type { Post } from "@/types/post";
import { generatedPostContents } from "@/lib/generatedPostContents";
import { generatedLegalArticleContents, generatedLegalArticleMetas } from "@/lib/generatedLegalArticleData";
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
    avatar: "/images/avukat-ceren-sumer-cilli.webp"
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
    id: "post-12",
    slug: "trump-bilim-insanlari-inceleme",
    title: "Trump yönetimi incelemede, Kongre bilgi peşinde; ölümler ve kayıplar UFO iddialarını yeniden alevlendirdi",
    excerpt:
      "ABD’de bilim insanlarının şüpheli ölümleri ve kayıpları, Kongre’nin resmi bilgi talebiyle ulusal güvenlik ve UFO/UAP tartışmalarını yeniden gündeme taşıdı.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-04-20"
  },
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
  },
  {
    id: "post-10",
    slug: "yapay-zeka-avukat-sorumlulugu",
    title: "Yapay Zeka ve Avukatın Hukuki Sorumluluğu",
    excerpt:
      "LegalTech dönüşümünde yapay zeka kullanımının avukat sorumluluğu, vekalet görevi ve meslek etiği üzerindeki etkileri.",
    type: "analiz",
    categorySlug: "analiz",
    featured: true,
    publishedAt: "2026-04-17"
  },
  {
    id: "post-11",
    slug: "adana-bosanma-arabuluculugu",
    title: "Adana Boşanma Arabuluculuğu ve Avukatın Rolü",
    excerpt:
      "Adana boşanma arabuluculuğu sürecinde avukatın vekalet görevi, yerel uygulama pratiği ve aile hukuku odaklı çözüm stratejileri.",
    type: "analiz",
    categorySlug: "analiz",
    featured: true,
    publishedAt: "2026-04-17"
  },
  {
    id: "post-13",
    slug: "tapuda-yeni-donem-guvenli-odeme-dijital-yetkilendirme",
    title: "Tapuda Yeni Dönem: Gayrimenkul Satışlarında Güvenli Ödeme ve Dijital Yetkilendirme Süreci",
    excerpt:
      "Gayrimenkul satışlarında güvenli ödeme sistemi, tapu devri öncesi risk kontrolleri ve e-Devlet taşınmaz ilan yetkilendirme uygulamasının alıcı-satıcı dengesi üzerindeki etkilerini inceliyoruz.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-04-24",
    seo: {
      metaTitle: "Tapuda Yeni Dönem: Güvenli Ödeme ve Dijital Yetkilendirme",
      metaDescription:
        "Gayrimenkul satışlarında güvenli ödeme, tapu işlemleri ve e-Devlet üzerinden taşınmaz ilan yetkilendirme süreci hakkında güncel hukuki değerlendirme.",
      focusKeyword: "tapu güvenli ödeme sistemi",
      secondaryKeywords: [
        "gayrimenkul satışında güvenli ödeme",
        "e-devlet taşınmaz ilan yetkilendirme",
        "tapu işlemleri 2026",
        "sahte emlak ilanları"
      ]
    },
    faq: [
      {
        question: "Gayrimenkul satışında güvenli ödeme sistemi nedir?",
        answer:
          "Güvenli ödeme sistemi, satış bedelinin tapu devriyle eş zamanlı ve doğrulanabilir şekilde aktarılmasını amaçlayan kontrollü ödeme modelidir."
      },
      {
        question: "Tapu devrinden önce ödeme yapmak riskli midir?",
        answer:
          "Evet. Devir tamamlanmadan yapılan ödeme, devir gerçekleşmezse iade ve ispat sorunlarına yol açabilir. Süreç mutlaka yazılı ve kontrollü ilerlemelidir."
      },
      {
        question: "e-Devlet taşınmaz ilan yetkilendirme ne işe yarar?",
        answer:
          "Taşınmazın ilanının gerçekten yetkili kişi veya kurumca verildiğinin dijital olarak doğrulanmasına yardımcı olur ve yetkisiz ilan riskini azaltır."
      },
      {
        question: "Sahte emlak ilanlarından korunmak için ne yapılmalı?",
        answer:
          "İlan verenin yetkisi doğrulanmalı, tapu ve takyidat kayıtları kontrol edilmeli, kapora ve ön ödeme süreçleri belgeli ve kontrollü yürütülmelidir."
      },
      {
        question: "Tapu satışında hukuki kontrol neden önemlidir?",
        answer:
          "Hukuki kontrol, mülkiyet devrini etkileyebilecek borç, şerh, ipotek ve temsil yetkisi sorunlarını önceden tespit ederek uyuşmazlık riskini düşürür."
      }
    ]
  },
  {
    id: "post-14",
    slug: "bosanmada-mal-paylasimi-gayrimenkuller-ev-arsa-arac",
    title: "Boşanmada Mal Paylaşımı ve Gayrimenkuller: Ev, Arsa ve Araçlar Nasıl Paylaşılır?",
    excerpt:
      "Boşanmada mal paylaşımı davasında ev, arsa ve araçların hangi rejime göre değerlendirildiğini; tapu kayıtları, kredi borçları ve ortaklığın giderilmesi başlıklarıyla ele alıyoruz.",
    type: "analiz",
    categorySlug: "analiz",
    featured: true,
    publishedAt: "2026-04-24",
    seo: {
      metaTitle: "Boşanmada Mal Paylaşımı ve Gayrimenkuller Nasıl Paylaşılır?",
      metaDescription:
        "Boşanmada ev, arsa, araç ve diğer malvarlığı değerlerinin nasıl paylaşıldığını; mal rejimi, edinilmiş mallar ve gayrimenkul uyuşmazlıkları yönünden açıklıyoruz.",
      focusKeyword: "boşanmada mal paylaşımı",
      secondaryKeywords: [
        "boşanmada ev paylaşımı",
        "boşanmada arsa paylaşımı",
        "boşanmada araç paylaşımı",
        "mal rejimi tasfiyesi",
        "Adana mal paylaşımı avukatı",
        "Adana gayrimenkul avukatı",
        "ortaklığın giderilmesi davası"
      ]
    },
    faq: [
      {
        question: "Boşanmada mal paylaşımı boşanma davası içinde mi görülür?",
        answer:
          "Kural olarak boşanma hükmü ile mal rejimi tasfiyesi ayrı hukuki inceleme alanlarıdır; uygulamada çoğu zaman farklı dava süreçleri yürütülür."
      },
      {
        question: "Evlilikten önce alınan ev boşanmada paylaşılır mı?",
        answer:
          "Genellikle kişisel mal sayılır; ancak evlilik içinde yapılan katkılar veya değer artış payı iddiası varsa ayrıca değerlendirme gerekir."
      },
      {
        question: "Boşanmada krediyle alınan ev nasıl paylaşılır?",
        answer:
          "Evin edinim tarihi, kredi ödemelerinin hangi dönemde ve kim tarafından yapıldığı ile kalan borç durumu birlikte incelenir."
      },
      {
        question: "Tapusu eşlerden birinin üzerinde olan ev paylaşılır mı?",
        answer:
          "Tapu tek başına belirleyici değildir. Mal rejimi kuralları ve katkı/pay alacağı iddialarıyla paylaşım veya alacak talebi gündeme gelebilir."
      },
      {
        question: "Ortaklığın giderilmesi davası boşanmadan sonra açılabilir mi?",
        answer:
          "Evet. Paylı veya elbirliği mülkiyeti devam eden taşınmazlarda, şartlar oluştuğunda boşanmadan sonra ortaklığın giderilmesi davası açılabilir."
      },
      {
        question: "Boşanmada araç paylaşımı nasıl yapılır?",
        answer:
          "Aracın edinim tarihi, ödeme kaynağı ve mevcut piyasa değeri dikkate alınarak mal rejimi kapsamında tasfiye hesabı yapılır."
      }
    ]
  },
  {
    id: "post-15",
    slug: "kira-uyusmazliklari-2026-ev-sahibi-kiraci",
    title: "Kira Uyuşmazlıklarında 2026 Gündemi: Ev Sahibi ve Kiracılar Nelere Dikkat Etmeli?",
    excerpt:
      "2026 yılında kira uyuşmazlıkları, tahliye süreçleri, kira artış oranı tartışmaları ve arabuluculuk uygulamaları bakımından ev sahibi-kiracı dengesini yeniden gündeme taşıyor.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-04-24",
    seo: {
      metaTitle: "Kira Uyuşmazlıklarında 2026 Gündemi",
      metaDescription:
        "2026 yılında kira uyuşmazlıkları, tahliye davaları, kira artış oranları ve arabuluculuk sürecinde ev sahibi ile kiracıların dikkat etmesi gereken hukuki noktalar.",
      focusKeyword: "kira uyuşmazlıkları 2026",
      secondaryKeywords: [
        "kira artış oranı",
        "tahliye davası",
        "kiracı hakları",
        "ev sahibi hakları",
        "kira arabuluculuk",
        "kira tespit davası",
        "kira sözleşmesi"
      ]
    },
    faq: [
      {
        question: "Kira uyuşmazlıklarında arabuluculuk zorunlu mu?",
        answer:
          "Kira alacağı, tahliye ve benzeri birçok kira uyuşmazlığında dava öncesi arabuluculuk şartı gündeme gelebilir; somut talep türüne göre değerlendirme yapılmalıdır."
      },
      {
        question: "Ev sahibi kiracıyı hemen çıkarabilir mi?",
        answer:
          "Kural olarak hayır. Tahliye için kanunda sayılan sebepler ve usule uygun bildirim/dava süreçlerinin tamamlanması gerekir."
      },
      {
        question: "Kira artış oranı nasıl hesaplanır?",
        answer:
          "Kira artışında sözleşme hükmü, yasal sınırlamalar ve ilgili dönemdeki resmi oranlar birlikte dikkate alınır."
      },
      {
        question: "Kira tespit davası ne zaman açılır?",
        answer:
          "Taraflar yeni dönem kira bedelinde anlaşamadığında ve yasal koşullar oluştuğunda kira tespit davası açılması gündeme gelir."
      },
      {
        question: "Kiracı tahliye taahhütnamesi imzaladıysa ne olur?",
        answer:
          "Geçerli bir tahliye taahhütnamesi varsa ev sahibi bu belgeye dayanarak tahliye süreci başlatabilir; belgenin geçerliliği somut olayda incelenir."
      }
    ]
  },
  {
    id: "post-16",
    slug: "cekismeli-bosanma-velayet-mal-paylasimi-aile-konutu",
    title: "Çekişmeli Boşanma Davasında Velayet, Mal Paylaşımı ve Aile Konutu Nasıl Değerlendirilir?",
    excerpt:
      "Çekişmeli boşanma davasında velayet, aile konutu, mal paylaşımı, tapu uyuşmazlıkları ve ortaklığın giderilmesi başlıklarının nasıl birlikte değerlendirildiğini ele alıyoruz.",
    type: "analiz",
    categorySlug: "analiz",
    featured: true,
    publishedAt: "2026-04-24",
    seo: {
      metaTitle: "Çekişmeli Boşanmada Velayet, Mal Paylaşımı ve Aile Konutu",
      metaDescription:
        "Çekişmeli boşanma davalarında velayet, mal paylaşımı, aile konutu, gayrimenkul uyuşmazlıkları ve boşanma sürecinde dikkat edilmesi gereken hukuki noktalar.",
      focusKeyword: "çekişmeli boşanma davası",
      secondaryKeywords: [
        "Adana çekişmeli boşanma avukatı",
        "velayet davası",
        "boşanmada mal paylaşımı",
        "aile konutu",
        "gayrimenkul uyuşmazlığı",
        "ortaklığın giderilmesi",
        "Adana boşanma avukatı"
      ]
    },
    faq: [
      {
        question: "Çekişmeli boşanma davası ne kadar sürer?",
        answer:
          "Süre; delil durumu, taleplerin kapsamı, velayet incelemeleri ve mahkemenin iş yüküne göre değişir."
      },
      {
        question: "Velayet hangi ölçütlere göre belirlenir?",
        answer:
          "Temel ölçüt çocuğun üstün yararıdır; bakım düzeni, eğitim sürekliliği ve ebeveynlerin koşulları birlikte değerlendirilir."
      },
      {
        question: "Boşanmada aile konutu kime bırakılır?",
        answer:
          "Somut olayın özelliklerine göre kullanım hakkı, çocukların düzeni ve tarafların korunma ihtiyacı dikkate alınarak karar verilir."
      },
      {
        question: "Tapusu eşlerden birinin üzerine olan ev paylaşılır mı?",
        answer:
          "Tapu tek başına belirleyici değildir; mal rejimi kuralları, edinim tarihi ve katkı iddiaları birlikte incelenir."
      },
      {
        question: "Mal paylaşımı davası boşanma davasından ayrı mı açılır?",
        answer:
          "Çoğu uyuşmazlıkta mal rejimi tasfiyesi ayrı yargılama konusu olur ve boşanma hükmünün kesinleşmesi sonrasında ilerler."
      },
      {
        question: "Ortaklığın giderilmesi davası boşanmadan sonra açılabilir mi?",
        answer:
          "Evet. Paylı mülkiyet devam ediyorsa boşanma sonrasında ortaklığın giderilmesi davası açılması mümkündür."
      }
    ]
  },
  {
    id: "post-17",
    slug: "yapay-zeka-avukatsiz-dava-dilekcesi",
    title: "Yargıya Güven Tartışılırken Yapay Zekâ ile Avukatsız Dava Açmak Riskli Bir Adım",
    excerpt:
      "Adalet Bakanı Akın Gürlek’in yapay zekâ destekli vatandaş platformu açıklaması, hukuk dünyasında avukatsız dava açma, hak kaybı riski ve yargıya güven tartışmalarını yeniden gündeme taşıdı.",
    type: "haber",
    categorySlug: "haber",
    featured: true,
    publishedAt: "2026-04-25",
    imageAlt: "Yapay zekâ destekli dava dilekçesi ve hukukta dijital dönüşüm tartışması",
    seo: {
      metaTitle: "Yapay Zekâ ile Avukatsız Dava Dilekçesi Tartışması",
      metaDescription:
        "Adalet Bakanı Akın Gürlek’in yapay zekâ destekli dava dilekçesi açıklaması, yargıya güven, avukatlık mesleği ve vatandaşın hak kaybı riski açısından tartışma yarattı.",
      focusKeyword: "yapay zeka avukatsız dava dilekçesi",
      secondaryKeywords: [
        "yapay zeka dava dilekçesi",
        "yapay zeka avukat",
        "avukatsız dava açma",
        "adalet bakanlığı yapay zeka",
        "hukukta yapay zeka",
        "yargıya güven",
        "Yapay Zekâ",
        "Avukatlık",
        "Dava Dilekçesi",
        "Adalet Bakanlığı",
        "Hukukta Dijitalleşme"
      ]
    }
  }
] as const;

const allPostMetas: ReadonlyArray<Omit<Post, "authorSlug" | "content" | "imageUrl">> = [
  ...postMetas,
  ...generatedLegalArticleMetas
];

const postImages: Record<string, string> = {
  "trump-bilim-insanlari-inceleme": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120",
  "tapuda-yeni-donem-guvenli-odeme-dijital-yetkilendirme":
    "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1200&q=80",
  "bosanmada-mal-paylasimi-gayrimenkuller-ev-arsa-arac":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "kira-uyusmazliklari-2026-ev-sahibi-kiraci":
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  "cekismeli-bosanma-velayet-mal-paylasimi-aile-konutu":
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  "yapay-zeka-avukatsiz-dava-dilekcesi":
    "/images/covers/yapay-zeka-avukatsiz-dava-dilekcesi.jpg"
};

export const staticPosts: Post[] = allPostMetas.map((meta) => ({
  ...meta,
  authorSlug: PRIMARY_AUTHOR_SLUG,
  content:
    generatedLegalArticleContents[meta.slug] ??
    generatedPostContents[meta.slug] ??
    "Bu içerik yakında eklenecek.",
  imageUrl: postImages[meta.slug] ?? null
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

function tokenize(value: string): string[] {
  return value
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function getKeywordSet(post: Post): Set<string> {
  const seoKeywords = [post.seo?.focusKeyword, ...(post.seo?.secondaryKeywords ?? [])]
    .filter(Boolean)
    .join(" ");
  const bag = `${post.title} ${post.excerpt} ${seoKeywords}`;
  return new Set(tokenize(bag));
}

export function getRelatedPosts(currentPost: Post, take = 3): Post[] {
  const pool = staticPosts.filter((post) => post.slug !== currentPost.slug);
  const currentKeywords = getKeywordSet(currentPost);
  const currentType = currentPost.type;
  const currentCategory = currentPost.categorySlug;

  const scored = pool.map((candidate) => {
    const candidateKeywords = getKeywordSet(candidate);
    let overlap = 0;
    for (const token of candidateKeywords) {
      if (currentKeywords.has(token)) overlap += 1;
    }

    const sameType = candidate.type === currentType ? 1 : 0;
    const sameCategory = candidate.categorySlug === currentCategory ? 1 : 0;
    const freshness = new Date(candidate.publishedAt).getTime();

    return {
      post: candidate,
      score: overlap * 3 + sameType * 4 + sameCategory * 2,
      freshness
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.freshness - a.freshness)
    .slice(0, take)
    .map((item) => item.post);
}

/** Sitemap ve toplu işlemler için */
export function getAllPosts(): Post[] {
  return sortByDateDesc(staticPosts);
}
