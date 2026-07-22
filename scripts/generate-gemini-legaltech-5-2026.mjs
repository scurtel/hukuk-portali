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
const PUBLISH_DATE = "2026-06-10";

const BANNED_PHRASES = [
  "en iyi avukat",
  "en başarılı avukat",
  "uzman avukat",
  "garantili sonuç",
  "kesin kazanılır",
  "en güvenilir hukuk bürosu",
  "mutlaka bizimle çalışın",
  "bizi arayın"
];

const PLATFORM_CTA = `Hukukportali.com, hukuk profesyonellerine yapay zekâ, dijital dönüşüm ve güncel mevzuat hakkında bilgi sunan bağımsız bir yayın platformudur. Somut uyuşmazlıklar için uzman değerlendirmesi gerekebilir; bu metin genel bilgilendirme niteliğindedir.`;

const DISCLAIMER = "Bu içerik genel bilgilendirme amacı taşır.";

const COMMON_INTERNAL_LINKS = [
  "/analizler/yapay-zeka-avukat-sorumlulugu",
  "/analizler/yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri",
  "/haber/yapay-zeka-avukatsiz-dava-dilekcesi",
  "/rehber/avukatlar-icin-yapay-zeka-hukuk-rehberi",
  "/rehber/dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
  "/kategori/analiz",
  "/kategori/haber"
];

const ARTICLES = [
  {
    title: "Avukatlar İçin Yapay Zekâ Kullanım Rehberi: Hangi İşlerde Kullanılır, Nerede Risk Başlar?",
    slug: "avukatlar-icin-yapay-zeka-kullanim-rehberi",
    type: "analiz",
    category: "LegalTech",
    metaTitle: "Avukatlar İçin Yapay Zekâ Kullanım Rehberi",
    metaDescription:
      "Avukatların yapay zekâ araçlarını hangi işlerde kullanabileceği, mesleki sorumluluk, gizlilik ve doğrulama yükümlülükleri açısından inceleniyor.",
    focusKeywords: [
      "avukatlar için yapay zeka",
      "hukukta yapay zeka",
      "legaltech",
      "yapay zeka avukatlık",
      "hukukportali.com"
    ],
    headings: [
      "Yapay Zekâ Hukuk Bürolarında Neden Gündemde?",
      "Avukatlar Yapay Zekâyı Hangi İşlerde Kullanabilir?",
      "Dilekçe Taslağı, Sözleşme İncelemesi ve Özetleme",
      "Nerede Risk Başlar?",
      "Müvekkil Sırrı ve Kişisel Veri Riski",
      "Yapay Zekâ Çıktıları Neden Mutlaka Kontrol Edilmeli?",
      "Hukuk Büroları İçin Güvenli Kullanım İlkeleri",
      "Sonuç"
    ],
    mustCover: [
      "Yapay zekâ yardımcı araçtır, avukatın hukuki değerlendirmesinin yerine geçmez.",
      "Çıktıların doğruluğu mutlaka kontrol edilmelidir.",
      "Müvekkil bilgileri üçüncü taraf araçlara girilmeden önce gizlilik ve KVKK açısından değerlendirilmelidir.",
      "Avukatın mesleki sorumluluğu devam eder."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "Yapay Zekâ ile Dilekçe Yazmak Güvenli mi? Avukatlık Mesleği Açısından Riskler",
    slug: "yapay-zeka-ile-dilekce-yazmak-guvenli-mi",
    type: "analiz",
    category: "Analiz",
    metaTitle: "Yapay Zekâ ile Dilekçe Yazmak Güvenli mi?",
    metaDescription:
      "Yapay zekâ ile dava dilekçesi hazırlamanın hak kaybı, yanlış hukuki nitelendirme ve avukatsız dava riski açısından sonuçları değerlendiriliyor.",
    focusKeywords: [
      "yapay zeka dilekçe",
      "avukatsız dava dilekçesi",
      "hukuki yapay zeka",
      "dava dilekçesi yapay zeka",
      "hukukportali.com"
    ],
    headings: [
      "Yapay Zekâ Dilekçe Hazırlayabilir mi?",
      "Dilekçe Sadece Metin Değildir",
      "Yanlış Hukuki Nitelendirme Riski",
      "Süre, Görev ve Yetki Hataları",
      "Delil ve Talep Sonucu Eksiklikleri",
      "Avukatsız Dava Açmanın Riskleri",
      "Yapay Zekâ Avukata Nasıl Yardımcı Olabilir?",
      "Sonuç"
    ],
    mustCover: [
      "Dava dilekçesi sadece güzel yazılmış metin değildir.",
      "Hukuki strateji, süreler, görevli mahkeme, yetkili mahkeme, deliller ve talepler önemlidir.",
      "Yapay zekâ taslak oluşturabilir ama hukuki sorumluluğu üstlenemez.",
      "Vatandaşın hak kaybı yaşamaması için dikkatli olunmalıdır."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "KVKK Açısından Yapay Zekâ Araçlarına Müvekkil Verisi Girmek Ne Kadar Riskli?",
    slug: "kvkk-yapay-zeka-muvekkil-verisi-riski",
    type: "analiz",
    category: "Analiz",
    metaTitle: "KVKK Açısından Yapay Zekâ ve Müvekkil Verisi",
    metaDescription:
      "Avukatların yapay zekâ araçlarına müvekkil verisi girerken KVKK, mesleki sır ve veri güvenliği açısından dikkat etmesi gereken noktalar.",
    focusKeywords: [
      "KVKK yapay zeka",
      "müvekkil verisi",
      "avukat mesleki sır",
      "yapay zeka veri güvenliği",
      "hukukportali.com"
    ],
    headings: [
      "Yapay Zekâ Araçları ve Kişisel Veri Meselesi",
      "Müvekkil Bilgisi Neden Hassastır?",
      "KVKK Açısından Temel İlkeler",
      "Açık Rıza Her Zaman Yeterli mi?",
      "Veri Minimizasyonu Nedir?",
      "Anonimleştirme ve Maskeleme Neden Önemli?",
      "Hukuk Büroları İçin Pratik Önlemler",
      "Sonuç"
    ],
    mustCover: [
      "Avukatlar müvekkil sırrını korumakla yükümlüdür.",
      "Kişisel veri içeren belgeler üçüncü taraf yapay zekâ araçlarına dikkatle aktarılmalıdır.",
      "Gereksiz veri paylaşımı yapılmamalıdır.",
      "Anonimleştirme, maskeleme ve kurum içi politika önemlidir.",
      "KVKK bakımından veri sorumlusu/veri işleyen tartışmalarına kısa değin."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "Hukuk Bürolarında Yapay Zekâ Politikası Nasıl Hazırlanır?",
    slug: "hukuk-burolarinda-yapay-zeka-politikasi",
    type: "rehber",
    category: "LegalTech",
    metaTitle: "Hukuk Bürolarında Yapay Zekâ Politikası",
    metaDescription:
      "Hukuk büroları için yapay zekâ kullanım politikası hazırlarken gizlilik, veri güvenliği, yetkilendirme ve çıktı kontrolü açısından dikkat edilmesi gerekenler.",
    focusKeywords: [
      "hukuk bürosu yapay zeka politikası",
      "legaltech politika",
      "avukatlıkta yapay zeka",
      "hukuk bürosu veri güvenliği",
      "hukukportali.com"
    ],
    headings: [
      "Hukuk Büroları Neden Yapay Zekâ Politikası Hazırlamalı?",
      "Politikanın Kapsamı Nasıl Belirlenir?",
      "Hangi Araçlar Kullanılabilir?",
      "Hangi Veriler Yapay Zekâya Girilmemeli?",
      "Çıktı Kontrolü ve İnsan Denetimi",
      "Yetkilendirme ve Eğitim",
      "Müvekkile Bilgilendirme Yapılmalı mı?",
      "Örnek Politika Başlıkları",
      "Sonuç"
    ],
    mustCover: [
      "Büro içinde herkesin farklı yapay zekâ aracı kullanması güvenlik riski oluşturabilir.",
      "Hangi araçların kullanılacağı belirlenmelidir.",
      "Müvekkil verisi, dava dosyası, kimlik bilgileri ve özel nitelikli kişisel veriler için özel kurallar konmalıdır.",
      "Her çıktı avukat tarafından kontrol edilmelidir.",
      "Büro personeline eğitim verilmelidir."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  },
  {
    title: "Yapay Zekâ Hukuki Araştırmada Nasıl Kullanılmalı? Emsal Karar, Mevzuat ve Halüsinasyon Riski",
    slug: "yapay-zeka-hukuki-arastirma-halusinasyon-riski",
    type: "analiz",
    category: "Analiz",
    metaTitle: "Yapay Zekâ ile Hukuki Araştırma ve Halüsinasyon Riski",
    metaDescription:
      "Yapay zekânın hukuki araştırmada kullanımı, emsal karar doğrulama, mevzuat kontrolü ve halüsinasyon riski açısından değerlendiriliyor.",
    focusKeywords: [
      "yapay zeka hukuki araştırma",
      "emsal karar yapay zeka",
      "hukuki halüsinasyon",
      "legaltech araştırma",
      "hukukportali.com"
    ],
    headings: [
      "Hukuki Araştırmada Yapay Zekâ Dönemi",
      "Yapay Zekâ Neyi İyi Yapar?",
      "Yapay Zekâ Neyi Yanlış Yapabilir?",
      "Halüsinasyon Riski Nedir?",
      "Sahte Emsal Karar ve Yanlış Mevzuat Riski",
      "Kaynak Doğrulama Neden Zorunludur?",
      "Avukatlar İçin Güvenli Araştırma Yöntemi",
      "Sonuç"
    ],
    mustCover: [
      "Yapay zekâ bazen olmayan kararları varmış gibi sunabilir.",
      "Mevzuat değişiklikleri güncel olmayabilir.",
      "Emsal kararlar mutlaka resmî veya güvenilir kaynaklardan doğrulanmalıdır.",
      "Yapay zekâ araştırmayı hızlandırır ama doğrulama yükümlülüğünü ortadan kaldırmaz."
    ],
    internalLinks: COMMON_INTERNAL_LINKS
  }
];

const COMMON_RULES = `
Uydurma Yargıtay/AYM kararı numarası, tarihi veya sahte Resmî Gazete/kanun değişikliği yazma.
Reklam kokmayan dil; avukatlık reklamı yasağına aykırı ifade kullanma.
Kişisel avukat adı (ör. Avukat Ceren Sümer Cilli) veya büro tanıtımı kullanma.
Yazar: Hukuk Portalı Editörleri veya hukukportali.com editöryal ekibi (en fazla 1 kez).
`.trim();

function getCommonBodyInstructions(spec) {
  return `
Sen hukukportali.com için Türkçe, özgün, SEO uyumlu hukuk haberi/analiz gövdesi yazıyorsun.
${COMMON_RULES}
Ton: Prestijli hukuk portalı; LegalTech ve mesleğin dönüşümü odaklı; avukat reklam sitesi değil.
İlk ~150 kelimede odak anahtar kelime geçsin.
Zorunlu H2 başlıkları (sırayla, ## ile): ${spec.headings.map((h) => `"${h}"`).join(", ")}
Mutlaka değin: ${spec.mustCover.join(" ")}
En az 2 iç link ver (markdown): ${spec.internalLinks.slice(0, 5).join(", ")}
Kısa paragraflar; en az bir markdown tablosu ve madde işaretli liste içer.
Kelime sayısı: ${MIN_WORDS}-${MAX_WORDS} (tüm gövde).
SSS gövdede AÇMA (ayrı JSON'da).
Gövde başında # H1 KULLANMA (sayfa başlığı ayrı render edilir); doğrudan giriş paragrafı veya ilk H2 ile başla.
Gövde sonunda H2 "Sonuç" bölümünden sonra sırayla: "${DISCLAIMER}"; ardından tek paragraf CTA (kelimesi kelimesine): "${PLATFORM_CTA}"
Çıktıda kod çiti veya JSON kullanma; yalnızca Markdown metin ver.
`.trim();
}

const COMMON_METADATA_INSTRUCTIONS = `
Sen hukukportali.com için Türkçe hukuki içerik meta verisi hazırlıyorsun.
${COMMON_RULES}
metaTitle en fazla 60 karakter; metaDescription en fazla 155 karakter.
SSS cevapları öz ama yeterli (her biri 3-5 cümle); Google arama niyetine uygun sorular.
Kişisel avukat/büro adı, "danışın", "randevu" reklamı kullanma.
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
    throw new Error(
      "Gemini API anahtarı bulunamadı. .env içinde GEMINI_API_KEY tanımlayın."
    );
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
  const found = BANNED_PHRASES.find((phrase) => lowered.includes(phrase.toLocaleLowerCase("tr")));
  if (found) throw new Error(`Yasak ifade bulundu: "${found}"`);
}

const BANNED_PERSONAL_NAMES = [/Avukat Ceren Sümer Cilli/i, /Ceren Sümer Cilli/i, /cerensumer\.av\.tr/i];

function ensureNoPersonalPromotion(text) {
  const hit = BANNED_PERSONAL_NAMES.find((re) => re.test(text));
  if (hit) throw new Error(`Kişisel tanıtım ifadesi bulundu: ${hit}`);
}

function extractJson(text) {
  const trimmed = text.trim();
  const clean = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(clean);
}

function stripOuterCodeFence(text) {
  const t = text.trim();
  if (!t.startsWith("```")) return t;
  return t.replace(/^```[a-z0-9_-]*\s*/i, "").replace(/\s*```$/i, "").trim();
}

function validateMetadataShape(meta) {
  const required = [
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
  ];
  for (const key of required) {
    if (meta[key] === undefined || meta[key] === null) {
      throw new Error(`Eksik meta alanı: ${key}`);
    }
  }
  if (!Array.isArray(meta.faq) || meta.faq.length !== 4) {
    throw new Error("faq tam 4 soru içermeli.");
  }
}

function validateArticleShape(article) {
  const required = [
    "title",
    "slug",
    "metaTitle",
    "metaDescription",
    "alternativeTitles",
    "excerpt",
    "focusKeywords",
    "helperKeywords",
    "internalLinks",
    "externalSourceSuggestions",
    "category",
    "tags",
    "featuredImageSuggestion",
    "socialShareText",
    "content",
    "faq",
    "conclusion",
    "type",
    "publishedAt"
  ];
  for (const key of required) {
    if (article[key] === undefined || article[key] === null) {
      throw new Error(`Eksik alan: ${key}`);
    }
  }
  if (!Array.isArray(article.faq) || article.faq.length !== 4) {
    throw new Error("faq tam 4 soru içermeli.");
  }
}

function clampText(s, max) {
  const t = String(s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim();
}

function buildMetadataPrompt(spec) {
  return `
${COMMON_METADATA_INSTRUCTIONS}

MAKALE:
Başlık: ${spec.title}
Slug: ${spec.slug}
Tür: ${spec.type}
Kategori: ${spec.category}
Önerilen meta title: ${spec.metaTitle}
Önerilen meta description: ${spec.metaDescription}
Odak kelimeler: ${spec.focusKeywords.join(", ")}
İç linkler (JSON'da aynen kullan): ${spec.internalLinks.join(", ")}

ÇIKTIYI SADECE GEÇERLİ JSON OLARAK VER. "content" alanı EKLEME.

JSON şeması:
{
  "title": "${spec.title.replace(/"/g, '\\"')}",
  "slug": "${spec.slug}",
  "metaTitle": "≤60 karakter",
  "metaDescription": "≤155 karakter",
  "alternativeTitles": ["", "", ""],
  "focusKeyword": "${spec.focusKeywords[0]}",
  "focusKeywords": ${JSON.stringify(spec.focusKeywords)},
  "helperKeywords": [],
  "internalLinks": ${JSON.stringify(spec.internalLinks)},
  "externalSourceSuggestions": ["", "", ""],
  "category": "${spec.category}",
  "tags": [],
  "featuredImageSuggestion": "SEO uyumlu kısa görsel açıklaması",
  "socialShareText": "",
  "excerpt": "2-3 cümle özet",
  "faq": [ { "question": "", "answer": "" } ],
  "conclusion": "Sonuç özeti"
}
faq tam 4 öğe; sorular Google'da aranacak tarzda olsun.
  `.trim();
}

function buildBodyMarkdownPrompt(spec, meta) {
  return `
${getCommonBodyInstructions(spec)}

BAĞLAM:
Başlık: ${meta.title}
Özet: ${meta.excerpt}
Odak kelime: ${meta.focusKeyword}
  `.trim();
}

async function generateJson(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ json: true, temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş yanıt verdi.");
  return text;
}

async function generatePlainText(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş metin verdi.");
  return appendSourcesMarkdown(text, extractGroundingFromGenaiResponse(response));
}

async function fixJson(ai, rawText) {
  const capped =
    rawText.length > 120_000 ? `${rawText.slice(0, 120_000)}\n/* kesildi */` : rawText;
  return generateJson(
    ai,
    `Bu çıktı geçerli JSON değil. Sadece geçerli JSON döndür.\n${capped}`
  );
}

async function parseJsonWithRepair(ai, raw, attempts = 5) {
  let last = raw;
  for (let i = 0; i < attempts; i++) {
    try {
      return extractJson(last);
    } catch (err) {
      if (i === attempts - 1) throw new Error(`JSON çözülemedi: ${err.message}`);
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
        ? `Gövde ${words} kelime. ${MIN_WORDS}-${MAX_WORDS} aralığına çıkar.`
        : `Gövde ${words} kelime. ${MIN_WORDS}-${MAX_WORDS} aralığına indir.`;

    const revisePrompt = `
Sadece geçerli JSON döndür; tek alan: "content".
${direction}
Zorunlu H2 başlıkları korunsun: ${spec.headings.join(", ")}
Kişisel avukat adı kullanma.
Sonunda disclaimer + CTA kalsın.

Mevcut content:
${current.content}
    `.trim();

    const revisedRaw = await generateJson(ai, revisePrompt);
    let parsed;
    try {
      parsed = extractJson(revisedRaw);
    } catch {
      parsed = extractJson(await fixJson(ai, revisedRaw));
    }
    current = { ...current, content: parsed.content.trim() };
    words = countWords(current.content);
    tries += 1;
  }

  return { article: current, words };
}

async function generateOneArticle(ai, spec) {
  console.log("  → Meta + SSS…");
  const metaRaw = await generateJson(ai, buildMetadataPrompt(spec));
  const meta = await parseJsonWithRepair(ai, metaRaw);
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
  const bodyMd = stripOuterCodeFence(await generatePlainText(ai, buildBodyMarkdownPrompt(spec, meta)));
  let article = { ...meta, content: bodyMd.trim() };
  validateArticleShape(article);

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

function saveArticleFiles(article) {
  const base = resolve(OUTPUT_DIR, article.slug);
  writeFileSync(`${base}.json`, `${JSON.stringify(article, null, 2)}\n`, "utf8");
}

async function main() {
  loadEnvFile();
  const { keyName, keyValue } = pickGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey: keyValue });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const force = process.argv.includes("--force");
  console.log(`Gemini: ${keyName}, Model: ${MODEL}, Makale: ${ARTICLES.length}`);

  const report = [];
  for (const spec of ARTICLES) {
    const jsonPath = resolve(OUTPUT_DIR, `${spec.slug}.json`);
    if (!force && existsSync(jsonPath)) {
      console.log(`Atlandı: ${spec.slug} (--force ile yenile)`);
      continue;
    }

    console.log(`\nÜretiliyor: ${spec.slug}`);
    const { article, words } = await generateOneArticle(ai, spec);
    saveArticleFiles(article);
    report.push({ slug: spec.slug, words, status: "saved" });
    console.log(`Kaydedildi: ${spec.slug} (${words} kelime)`);
  }

  writeFileSync(
    resolve(OUTPUT_DIR, "generation-report-legaltech-5-2026.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );
}

main().catch((err) => {
  console.error("\nHATA:", err.message);
  process.exit(1);
});
