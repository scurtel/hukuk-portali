import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GENERATED_DIR = resolve("generated-articles");
const OUTPUT_FILE = resolve("lib/generatedLegalArticleData.ts");

const TYPE_BY_SLUG = {
  "turkiyede-avukat-sayilari-2025": "haber",
  "tapuda-avukat-zorunlulugu-gelirse-vatandas-ne-yapacak": "haber",
  "bosanmadan-once-evin-satilmasi-mal-kacirma-sayilir-mi": "analiz",
  "tapu-iptal-ve-tescil-davasi-hangi-durumlarda-acilir": "analiz",
  "bosanma-davasi-surerken-olum": "analiz",
  "whatsapp-mesaji-mahkemede-delil": "analiz",
  "bosanmada-mal-paylasimi-2026-rehber": "rehber",
  "velayet-davasinda-hakim-kriterleri": "rehber",
  "tapu-iptal-tescil-davasi-sik-sebepler": "rehber",
  "avukatlar-icin-yapay-zeka-hukuk-rehberi": "rehber",
  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri": "analiz",
  "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi": "rehber",
  "avukatlar-icin-yapay-zeka-kullanim-rehberi": "analiz",
  "yapay-zeka-ile-dilekce-yazmak-guvenli-mi": "analiz",
  "kvkk-yapay-zeka-muvekkil-verisi-riski": "analiz",
  "hukuk-burolarinda-yapay-zeka-politikasi": "rehber",
  "yapay-zeka-hukuki-arastirma-halusinasyon-riski": "analiz"
};

/** Anasayfa öne çıkan + güncel tarih (placeholder kapak posts.ts postImages ile) */
const PROMOTED_LEGAL_SLUGS = new Set([
  "bosanmada-mal-paylasimi-2026-rehber",
  "velayet-davasinda-hakim-kriterleri",
  "tapu-iptal-tescil-davasi-sik-sebepler",
  "bosanma-davasi-surerken-olum",
  "whatsapp-mesaji-mahkemede-delil",
  "avukatlar-icin-yapay-zeka-hukuk-rehberi",
  "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri",
  "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi"
]);

const PROMOTED_PUBLISH_DATE = "2026-05-14";
const AI_LAWYER_PUBLISH_DATE = "2026-05-15";
const HOT_HABER_SLUGS = new Set(["turkiyede-avukat-sayilari-2025"]);

function getPostType(slug) {
  return TYPE_BY_SLUG[slug] || "rehber";
}

function getCategorySlug(type) {
  if (type === "haber") return "haber";
  if (type === "analiz") return "analiz";
  return "rehber";
}

function isLegalArticleJson(data) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    typeof data.slug === "string" &&
    data.slug.length > 0 &&
    typeof data.title === "string" &&
    typeof data.content === "string" &&
    typeof data.metaTitle === "string" &&
    typeof data.metaDescription === "string"
  );
}

function buildMeta(article, index) {
  const type = article.type === "haber" || article.type === "analiz" || article.type === "rehber"
    ? article.type
    : getPostType(article.slug);
  const keywords = Array.isArray(article.focusKeywords) ? article.focusKeywords : [];
  const faq = Array.isArray(article.faq)
    ? article.faq.map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim()
      }))
    : [];

  const publishedAt =
    typeof article.publishedAt === "string"
      ? article.publishedAt
      : HOT_HABER_SLUGS.has(article.slug)
        ? "2026-06-01"
        : article.slug === "avukatlar-icin-yapay-zeka-hukuk-rehberi" ||
          article.slug === "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri" ||
          article.slug === "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi"
        ? AI_LAWYER_PUBLISH_DATE
        : PROMOTED_LEGAL_SLUGS.has(article.slug)
          ? PROMOTED_PUBLISH_DATE
          : "2026-04-27";
  const updatedAt = typeof article.updatedAt === "string" ? article.updatedAt : publishedAt;

  const imageAlt =
    (typeof article.featuredImageSuggestion === "string" && article.featuredImageSuggestion.trim()) ||
    `${article.title} — kapak görseli`;

  return {
    id: `post-${200 + index}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    type,
    categorySlug: getCategorySlug(type),
    featured: article.featured === true || PROMOTED_LEGAL_SLUGS.has(article.slug) || HOT_HABER_SLUGS.has(article.slug),
    publishedAt,
    updatedAt,
    imageAlt,
    seo: {
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      focusKeyword: (typeof article.focusKeyword === "string" && article.focusKeyword) || keywords[0] || "",
      secondaryKeywords: keywords.slice(1)
    },
    faq
  };
}

function main() {
  const files = readdirSync(GENERATED_DIR)
    .filter((name) => name.endsWith(".json"))
    .filter((name) => !name.startsWith("generation-report"))
    .sort();

  if (files.length === 0) {
    throw new Error("generated-articles içinde yayınlanacak JSON bulunamadı.");
  }

  const articles = [];
  for (const file of files) {
    const raw = readFileSync(resolve(GENERATED_DIR, file), "utf8");
    const data = JSON.parse(raw);
    if (!isLegalArticleJson(data)) {
      console.warn(`Atlandı (makale JSON değil): ${file}`);
      continue;
    }
    articles.push(data);
  }

  articles.sort((a, b) => a.slug.localeCompare(b.slug, "tr"));

  if (articles.length === 0) {
    throw new Error("generated-articles içinde geçerli makale JSON bulunamadı (generation-report dışı).");
  }

  const metas = articles.map((article, index) => buildMeta(article, index));
  const contents = Object.fromEntries(articles.map((article) => [article.slug, article.content]));

  const source = `import type { Post } from "@/types/post";

export const generatedLegalArticleMetas: ReadonlyArray<Omit<Post, "authorSlug" | "content" | "imageUrl">> = ${JSON.stringify(
    metas,
    null,
    2
  )};

export const generatedLegalArticleContents: Record<string, string> = ${JSON.stringify(contents, null, 2)};
`;

  writeFileSync(OUTPUT_FILE, `${source}\n`, "utf8");
  console.log(`Yayın verisi oluşturuldu: ${OUTPUT_FILE}`);
}

main();
