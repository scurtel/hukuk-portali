import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const GENERATED_DIR = resolve("generated-articles");
const OUTPUT_FILE = resolve("lib/generatedLegalArticleData.ts");

const TYPE_BY_SLUG = {
  "tapuda-avukat-zorunlulugu-gelirse-vatandas-ne-yapacak": "haber",
  "bosanmadan-once-evin-satilmasi-mal-kacirma-sayilir-mi": "analiz",
  "tapu-iptal-ve-tescil-davasi-hangi-durumlarda-acilir": "analiz"
};

function getPostType(slug) {
  return TYPE_BY_SLUG[slug] || "rehber";
}

function getCategorySlug(type) {
  if (type === "haber") return "haber";
  if (type === "analiz") return "analiz";
  return "rehber";
}

function buildMeta(article, index) {
  const type = getPostType(article.slug);
  const keywords = Array.isArray(article.focusKeywords) ? article.focusKeywords : [];
  const faq = Array.isArray(article.faq)
    ? article.faq.map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim()
      }))
    : [];

  return {
    id: `post-${200 + index}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    type,
    categorySlug: getCategorySlug(type),
    featured: false,
    publishedAt: "2026-04-27",
    seo: {
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      focusKeyword: keywords[0] || "",
      secondaryKeywords: keywords.slice(1)
    },
    faq
  };
}

function main() {
  const files = readdirSync(GENERATED_DIR)
    .filter((name) => name.endsWith(".json") && name !== "generation-report.json")
    .sort();

  if (files.length === 0) {
    throw new Error("generated-articles içinde yayınlanacak JSON bulunamadı.");
  }

  const articles = files.map((file) => {
    const raw = readFileSync(resolve(GENERATED_DIR, file), "utf8");
    return JSON.parse(raw);
  });

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
