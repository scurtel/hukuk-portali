import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";
import {
  buildGeminiGenerateConfig,
  extractGroundingFromGenaiResponse,
  appendSourcesMarkdown
} from "./lib/gemini-config.mjs";

const OUTPUT_DIR = resolve("generated-articles");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MIN_WORDS = 900;
const MAX_WORDS = 1300;
const PUBLISH_DATE = new Date().toISOString().slice(0, 10);

const BANNED_PHRASES = [
  "en iyi avukat",
  "en başarılı avukat",
  "uzman avukat",
  "garantili sonuç",
  "kesin kazanılır",
  "en güvenilir hukuk bürosu",
  "mutlaka bizimle çalışın",
  "bizi arayın",
  "hukuki danışmanlık değildir",
  "reklam değildir",
  "bu yazı reklam"
];

const COMMON_INTERNAL_LINKS = [
  "/analizler/avukatlar-icin-yapay-zeka-kullanim-rehberi",
  "/analizler/kvkk-yapay-zeka-muvekkil-verisi-riski",
  "/analizler/yapay-zeka-avukat-sorumlulugu",
  "/rehber/hukuk-burolarinda-yapay-zeka-politikasi",
  "/haber/turkiyede-avukat-sayilari-2025",
  "/konu/yapay-zeka",
  "/kategori/analiz"
];

const ARTICLES = [
  {
    title: "Yapay Zekâ Avukatların İş Akışını Nasıl Değiştiriyor?",
    slug: "yapay-zeka-avukatlarin-is-akisini-nasil-degistiriyor",
    type: "analiz",
    category: "Yapay Zekâ",
    metaTitle: "Yapay Zekâ Avukatların İş Akışını Nasıl Değiştiriyor?",
    metaDescription:
      "Dilekçe taslağı, içtihat araştırması, sözleşme inceleme ve müvekkil iletişiminde yapay zekânın avukatlık pratiğine etkisi analiz ediliyor.",
    focusKeywords: [
      "yapay zeka avukat iş akışı",
      "hukukta yapay zeka",
      "avukatlıkta otomasyon",
      "legaltech",
      "hukukportali.com"
    ],
    headings: [
      "Hukuk Bürolarında Dijital Dönüşümün Yeni Aşaması",
      "Dilekçe ve Belge Hazırlığında Yapay Zekâ",
      "İçtihat ve Mevzuat Araştırmasında Hız Kazanımı",
      "Sözleşme İnceleme ve Risk Taraması",
      "Müvekkil İletişimi ve Bilgi Akışı",
      "İnsan Denetimi Neden Vazgeçilmez?",
      "Sonuç"
    ],
    mustCover: [
      "Yapay zekâ tekrarlayan işleri hızlandırır; stratejik karar avukatta kalır.",
      "Dilekçe taslağı, özetleme ve araştırma desteği en yaygın kullanım alanlarıdır.",
      "Çıktılar doğrulanmadan dosyaya girmemelidir.",
      "Büro içi süreçler yeniden tasarlanırken veri güvenliği göz önünde tutulmalıdır."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "Hukuk Büroları İçin Yapay Zekâ Kullanımında Riskler ve Dikkat Edilmesi Gerekenler",
    slug: "hukuk-burolarinda-yapay-zeka-kullaniminda-riskler",
    type: "analiz",
    category: "Hukuk Teknolojileri",
    metaTitle: "Hukuk Bürolarında Yapay Zekâ Kullanım Riskleri",
    metaDescription:
      "Kişisel veri, KVKK, sır saklama, hatalı çıktı ve insan denetimi açısından hukuk bürolarında yapay zekâ kullanımının riskleri.",
    focusKeywords: [
      "hukuk bürosu yapay zeka riskleri",
      "KVKK avukat",
      "yapay zeka mesleki sır",
      "legaltech güvenlik",
      "hukukportali.com"
    ],
    headings: [
      "Yapay Zekâ Bürolarda Neden Hızla Yayılıyor?",
      "Kişisel Veri ve KVKK Boyutu",
      "Mesleki Sır ve Gizlilik Yükümlülüğü",
      "Hatalı veya Eksik Çıktı Riski",
      "İnsan Denetimi ve Mesleki Sorumluluk",
      "Büro Yöneticileri İçin Pratik Önlemler",
      "Sonuç"
    ],
    mustCover: [
      "Üçüncü taraf yapay zekâ araçlarına ham müvekkil verisi aktarımı risklidir.",
      "KVKK ve mesleki sır birlikte değerlendirilmelidir.",
      "Politika, eğitim ve onaylı araç listesi önemlidir.",
      "Nihai hukuki değerlendirme sorumluluğu avukatta kalır."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "Türkiye'de Hukuk Teknolojileri Neden Yeni Bir Döneme Giriyor?",
    slug: "turkiyede-hukuk-teknolojileri-yeni-donem",
    type: "haber",
    category: "Hukuk Gündemi",
    metaTitle: "Türkiye'de Hukuk Teknolojileri Yeni Dönem",
    metaDescription:
      "Dijitalleşme, UYAP, e-duruşma, yapay zekâ ve otomasyonun Türkiye'de hukuk sektörünü dönüştürmesi ve genç hukukçuların rolü.",
    focusKeywords: [
      "hukuk teknolojileri türkiye",
      "legaltech türkiye",
      "uyap dijitalleşme",
      "hukuk sektörü yapay zeka",
      "hukukportali.com"
    ],
    headings: [
      "Hukuk Sektöründe Dönüşümün Arkasındaki Dinamikler",
      "UYAP ve Dijital Adli Süreçler",
      "E-Duruşma ve Uzaktan Yargılama Pratiği",
      "Yapay Zekâ ve Otomasyon Araçlarının Yükselişi",
      "Genç Hukukçular ve Teknoloji Adaptasyonu",
      "Bürolar İçin Stratejik Mesaj",
      "Sonuç"
    ],
    mustCover: [
      "Türkiye'de dijital adalet altyapısı ve büro otomasyonu birlikte ilerliyor.",
      "Yapay zekâ araştırma ve belge işlerini hızlandırıyor; regülasyon ve etik tartışmalar sürüyor.",
      "Genç avukatlar teknolojiyle daha yakın çalışıyor.",
      "Uydurma kanun veya kesin yürürlük tarihi yazma; genel trend anlat."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  }
];

const COMMON_RULES = `
Türkçe, özgün, hukuk haber sitesi formatında, avukat reklamı içermeyen, SEO uyumlu, editoryal analiz diliyle yaz.
Uydurma Yargıtay/AYM kararı numarası, sahte mevzuat veya doğrulanmamış kesin yürürlük iddiası kullanma.
Kişisel avukat adı (Avukat Ceren Sümer Cilli vb.) veya büro tanıtımı kullanma.
"En iyi avukat", "garanti", "danışın", "bizi arayın" gibi ifadeler yasak.
"Bu yazı reklam değildir", "hukuki danışmanlık değildir" gibi kalıplar kullanma.
Doğal, editoryal, profesyonel ton; mekanik yapay zekâ dili kullanma.
`.trim();

function getCommonBodyInstructions(spec) {
  return `
Sen hukukportali.com için makale gövdesi yazıyorsun.
${COMMON_RULES}
Kelime sayısı: ${MIN_WORDS}-${MAX_WORDS}.
Zorunlu H2 başlıkları (sırayla ## ile): ${spec.headings.map((h) => `"${h}"`).join(", ")}
Mutlaka değin: ${spec.mustCover.join(" ")}
En az 2 iç link (markdown): ${spec.internalLinks.slice(0, 5).join(", ")}
Güçlü giriş paragrafı; kısa paragraflar; en az bir madde listesi.
Gövde başında # H1 KULLANMA.
Gövde "Sonuç" H2 ile bitsin; sonrasına feragat/CTA/reklam uyarısı EKLEME.
SSS gövdede açma.
Yalnızca Markdown döndür.
`.trim();
}

const COMMON_METADATA_INSTRUCTIONS = `
${COMMON_RULES}
metaTitle ≤60 karakter; metaDescription ≤155 karakter.
tags: 5-7 adet, konuyla ilgili.
faq: tam 4 soru, Google arama niyetine uygun.
`.trim();

function loadEnvFile() {
  try {
    const source = readFileSync(resolve(".env"), "utf8");
    for (const rawLine of source.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    /* .env yok */
  }
}

function pickGeminiApiKey() {
  const keyName =
    (process.env.GEMINI_API_KEY && "GEMINI_API_KEY") ||
    (process.env.GOOGLE_GEMINI_API_KEY && "GOOGLE_GEMINI_API_KEY") ||
    (process.env.GOOGLE_GENERATIVE_AI_API_KEY && "GOOGLE_GENERATIVE_AI_API_KEY");
  if (!keyName) {
    throw new Error("Gemini API anahtarı bulunamadı (.env içinde GEMINI_API_KEY).");
  }
  return { keyName, keyValue: process.env[keyName] };
}

function countWords(text) {
  return text
    .replace(/[#*_`>\-\[\]\(\)|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function ensureNoBannedPhrases(text) {
  const lowered = text.toLocaleLowerCase("tr");
  const found = BANNED_PHRASES.find((p) => lowered.includes(p.toLocaleLowerCase("tr")));
  if (found) throw new Error(`Yasak ifade: "${found}"`);
}

const BANNED_PERSONAL_NAMES = [/Avukat Ceren Sümer Cilli/i, /Ceren Sümer Cilli/i, /cerensumer\.av\.tr/i];

function ensureNoPersonalPromotion(text) {
  const hit = BANNED_PERSONAL_NAMES.find((re) => re.test(text));
  if (hit) throw new Error(`Kişisel tanıtım: ${hit}`);
}

function extractJson(text) {
  const clean = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(clean);
}

function stripOuterCodeFence(text) {
  const t = text.trim();
  if (!t.startsWith("```")) return t;
  return t.replace(/^```[a-z0-9_-]*\s*/i, "").replace(/\s*```$/i, "").trim();
}

function validateMetadataShape(meta) {
  for (const key of [
    "title",
    "slug",
    "metaTitle",
    "metaDescription",
    "alternativeTitles",
    "focusKeyword",
    "excerpt",
    "focusKeywords",
    "helperKeywords",
    "internalLinks",
    "externalSourceSuggestions",
    "category",
    "tags",
    "featuredImageSuggestion",
    "socialShareText",
    "faq",
    "conclusion"
  ]) {
    if (meta[key] === undefined || meta[key] === null) throw new Error(`Eksik meta: ${key}`);
  }
  if (!Array.isArray(meta.tags) || meta.tags.length < 5 || meta.tags.length > 7) {
    throw new Error("tags 5-7 öğe olmalı.");
  }
  if (!Array.isArray(meta.faq) || meta.faq.length !== 4) {
    throw new Error("faq tam 4 soru olmalı.");
  }
}

function validateArticleShape(article) {
  validateMetadataShape(article);
  if (!article.content || !article.type || !article.publishedAt) {
    throw new Error("content, type veya publishedAt eksik.");
  }
}

function clampText(s, max) {
  const t = String(s || "").trim();
  return t.length <= max ? t : t.slice(0, max).trim();
}

function buildMetadataPrompt(spec) {
  return `
${COMMON_METADATA_INSTRUCTIONS}

Başlık: ${spec.title}
Slug: ${spec.slug}
Tür: ${spec.type}
Kategori: ${spec.category}
Önerilen meta title: ${spec.metaTitle}
Önerilen meta description: ${spec.metaDescription}
Odak kelimeler: ${spec.focusKeywords.join(", ")}
İç linkler: ${spec.internalLinks.join(", ")}

Sadece geçerli JSON döndür ("content" yok):

{
  "title": "${spec.title.replace(/"/g, '\\"')}",
  "slug": "${spec.slug}",
  "metaTitle": "",
  "metaDescription": "",
  "alternativeTitles": ["", "", ""],
  "focusKeyword": "${spec.focusKeywords[0]}",
  "focusKeywords": ${JSON.stringify(spec.focusKeywords)},
  "helperKeywords": [],
  "internalLinks": ${JSON.stringify(spec.internalLinks)},
  "externalSourceSuggestions": ["", "", ""],
  "category": "${spec.category}",
  "tags": [],
  "featuredImageSuggestion": "",
  "socialShareText": "",
  "excerpt": "",
  "faq": [],
  "conclusion": ""
}
`.trim();
}

function buildBodyMarkdownPrompt(spec, meta) {
  return `
${getCommonBodyInstructions(spec)}

Başlık: ${meta.title}
Özet: ${meta.excerpt}
Odak: ${meta.focusKeyword}
`.trim();
}

async function generateJson(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ json: true, temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş JSON.");
  return text;
}

async function generatePlainText(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş metin.");
  return appendSourcesMarkdown(text, extractGroundingFromGenaiResponse(response));
}

async function fixJson(ai, raw) {
  return generateJson(ai, `Geçerli JSON döndür:\n${raw.slice(0, 120_000)}`);
}

async function parseJsonWithRepair(ai, raw) {
  let last = raw;
  for (let i = 0; i < 5; i++) {
    try {
      return extractJson(last);
    } catch (err) {
      if (i === 4) throw err;
      last = await fixJson(ai, last);
    }
  }
}

async function enforceWordWindow(ai, article, spec) {
  let current = { ...article };
  let words = countWords(current.content);
  let tries = 0;
  while ((words < MIN_WORDS || words > MAX_WORDS) && tries < 5) {
    const direction =
      words < MIN_WORDS
        ? `Gövde ${words} kelime; ${MIN_WORDS}-${MAX_WORDS} aralığına çıkar.`
        : `Gövde ${words} kelime; ${MIN_WORDS}-${MAX_WORDS} aralığına indir.`;
    const revisedRaw = await generateJson(
      ai,
      `Sadece JSON {"content":"..."} döndür. ${direction} H2 başlıkları koru. Feragat/CTA ekleme.\n${current.content}`
    );
    let parsed;
    try {
      parsed = extractJson(revisedRaw);
    } catch {
      parsed = extractJson(await fixJson(ai, revisedRaw));
    }
    current = { ...current, content: String(parsed.content || "").trim() };
    words = countWords(current.content);
    tries += 1;
  }
  return { article: current, words };
}

async function generateOneArticle(ai, spec) {
  console.log("  → Meta…");
  const meta = await parseJsonWithRepair(ai, await generateJson(ai, buildMetadataPrompt(spec)));
  validateMetadataShape(meta);
  meta.slug = spec.slug;
  meta.title = spec.title;
  meta.metaTitle = clampText(spec.metaTitle || meta.metaTitle, 60);
  meta.metaDescription = clampText(spec.metaDescription || meta.metaDescription, 155);
  meta.type = spec.type;
  meta.publishedAt = PUBLISH_DATE;
  meta.updatedAt = PUBLISH_DATE;
  meta.featured = true;

  console.log("  → Gövde…");
  const bodyMd = stripOuterCodeFence(
    await generatePlainText(ai, buildBodyMarkdownPrompt(spec, meta))
  );
  let article = { ...meta, content: bodyMd.trim() };
  const revised = await enforceWordWindow(ai, article, spec);
  article = revised.article;
  const words = countWords(article.content);
  validateArticleShape(article);
  ensureNoBannedPhrases(article.content);
  ensureNoPersonalPromotion(article.content);
  if (words < MIN_WORDS || words > MAX_WORDS) {
    throw new Error(`Kelime aralığı sağlanamadı (${words}): ${spec.slug}`);
  }
  return { article, words };
}

async function main() {
  loadEnvFile();
  const { keyName, keyValue } = pickGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey: keyValue });
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const force = process.argv.includes("--force");
  console.log(`Gemini: ${keyName}, Model: ${MODEL}, Tarih: ${PUBLISH_DATE}`);

  const report = [];
  for (const spec of ARTICLES) {
    const jsonPath = resolve(OUTPUT_DIR, `${spec.slug}.json`);
    if (!force && existsSync(jsonPath)) {
      console.log(`Atlandı: ${spec.slug}`);
      continue;
    }
    console.log(`\nÜretiliyor: ${spec.slug}`);
    const { article, words } = await generateOneArticle(ai, spec);
    writeFileSync(`${jsonPath}`, `${JSON.stringify(article, null, 2)}\n`, "utf8");
    report.push({ slug: spec.slug, words });
    console.log(`Kaydedildi (${words} kelime)`);
  }
  writeFileSync(
    resolve(OUTPUT_DIR, "generation-report-legaltech-3-batch.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );
}

main().catch((err) => {
  console.error("\nHATA:", err.message);
  process.exit(1);
});
