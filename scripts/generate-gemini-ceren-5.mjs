import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";
import {
  buildGeminiGenerateConfig,
  extractGroundingFromGenaiResponse,
  appendSourcesMarkdown
} from "./lib/gemini-config.mjs";

/** Çıktı: proje kökünde generated-articles/ */
const OUTPUT_DIR = resolve("generated-articles");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MIN_WORDS = 900;
const MAX_WORDS = 1400;

const BANNED_PHRASES = [
  "en iyi avukat",
  "en başarılı avukat",
  "garantili sonuç",
  "kesin kazanılır",
  "en güvenilir hukuk bürosu",
  "mutlaka bizimle çalışın"
];

const AI_LAWYER_ONLY = process.argv.includes("--ai-lawyer-only");

const PLATFORM_CTA = `Hukukportali.com, hukuk profesyonellerine yapay zekâ, dijital dönüşüm ve güncel mevzuat hakkında bilgi sunan bağımsız bir yayın platformudur. Somut uyuşmazlıklar için uzman değerlendirmesi gerekebilir; bu metin genel bilgilendirme niteliğindedir.`;

function getFixedCta() {
  return PLATFORM_CTA;
}

const DISCLAIMER =
  "Bu içerik genel bilgilendirme niteliğindedir, somut olayın koşullarına göre hukuki değerlendirme değişebilir.";

function getCommonBodyInstructions() {
  return `
Sen hukukportali.com için Türkçe, özgün, SEO uyumlu hukuki bilgilendirme gövdesi yazıyorsun.
${COMMON_RULES}
Kişisel avukat veya hukuk bürosu adı kullanma; gerekiyorsa yalnızca "hukukportali.com" veya "Hukukportali Editör Ekibi" (en fazla 1-2 kez).
İlk ~150 kelimede odak anahtar kelime geçsin.
H2 ve H3 kullan; kısa paragraflar; en az bir markdown tablosu ve madde işaretli liste içer.
Kelime sayısı: ${MIN_WORDS}-${MAX_WORDS} (tüm gövde).
SSS ve JSON alanları ayrı üretildi; gövdede "Sık sorulan sorular" başlığı AÇMA (tekrar etme).
Gövde sonuna sırayla ekle: H2 "Sonuç" ile kısa bir özet paragraf; ardından "${DISCLAIMER}"; ardından tek paragraf CTA (kelimesi kelimesine): "${getFixedCta()}"
Çıktıda kod çiti veya JSON kullanma; yalnızca Markdown metin ver.
`.trim();
}

const COMMON_RULES = `
Uydurma Yargıtay/AYM kararı numarası, tarihi veya sahte Resmî Gazete/kanun değişikliği yazma. Kaynak doğrulanamıyorsa "genel hukuki değerlendirme" çerçevesinde yaz.
Reklam kokmayan dil; "en iyi avukat", "kesin kazanılır", "garanti sonuç" kullanma.
`.trim();

/** Meta + SSS JSON aşaması (küçük çıktı; gövde ayrı üretilir) */
const COMMON_METADATA_INSTRUCTIONS = `
Sen hukukportali.com için Türkçe hukuki içerik meta verisi hazırlıyorsun.
${COMMON_RULES}
metaTitle en fazla 60 karakter; metaDescription en fazla 155 karakter.
SSS cevapları öz ama yeterli olsun (her biri yaklaşık 3-6 cümle).
Kişisel avukat/büro adı, "danışın", "randevu" reklamı kullanma; yayıncı: hukukportali.com / Hukukportali Editör Ekibi.
`.trim();

const CEREN_ARTICLES = [
  {
    title: "Boşanma Davasında Mal Paylaşımı Nasıl Yapılır? 2026 Güncel Rehber",
    slug: "bosanmada-mal-paylasimi-2026-rehber",
    focusKeywords: [
      "boşanmada mal paylaşımı",
      "mal paylaşımı davası",
      "edinilmiş mallara katılma rejimi",
      "boşanma avukatı",
      "hukukportali.com"
    ],
    internalLinks: [
      "/aile-hukuku/",
      "/bosanma-hukuku/",
      "/mal-paylasimi-davasi/",
      "/bosanma-sureci/",
      "/bosanma-avukati/"
    ],
    objective: `Boşanma sonrası ev, araba, banka hesabı, şirket hissesi, ziynet ve kredi borcu gibi konuları anlaşılır anlat. Mal rejimi ve edinilmiş mallara katılma çerçevesinde genel bilgilendirme yap. Kişisel avukat tanıtımı yapma.`
  },
  {
    title: "Velayet Davasında Hakim Neye Bakar? Anne ve Baba İçin Güncel Hukuki Kriterler",
    slug: "velayet-davasinda-hakim-kriterleri",
    focusKeywords: [
      "velayet davası",
      "çocuğun üstün yararı",
      "boşanmada velayet",
      "ortak velayet",
      "Adana boşanma avukatı",
      "hukukportali.com"
    ],
    internalLinks: [
      "/bosanmada-velayet/",
      "/cocugun-ustun-yarari/",
      "/sosyal-inceleme-raporu/",
      "/nafaka/",
      "/aile-hukuku/"
    ],
    objective: `Çocuğun yaşı, eğitim, psikolojik ihtiyaçlar, ebeveyn yaşam koşulları, sosyal inceleme raporu ve çocuğun görüşünü anlat. Duygusal ama güvenilir dil. Ortak velayet pratik tartışmalarını özetle.`
  },
  {
    title: "Tapu İptal ve Tescil Davası Nedir? En Sık Görülen Sebepler",
    slug: "tapu-iptal-tescil-davasi-sik-sebepler",
    focusKeywords: [
      "tapu iptal ve tescil davası",
      "mirastan mal kaçırma",
      "muris muvazaası",
      "gayrimenkul avukatı",
      "hukukportali.com"
    ],
    internalLinks: [
      "/gayrimenkul-hukuku/",
      "/miras-hukuku/",
      "/tapu-iptal-tescil/",
      "/muvazaa/",
      "/miras-uyusmazligi/"
    ],
    objective: `Muris muvazaası, vekaletname/şekil, ehliyetsizlik, hile, aile içi mal kaçırma ve miras uyuşmazlıkları üzerinden rehber yaz. Genel bilgilendirme tonu; kişisel avukat tanıtımı yok.`
  },
  {
    title: "Boşanma Davası Devam Ederken Eşlerden Biri Ölürse Ne Olur?",
    slug: "bosanma-davasi-surerken-olum",
    focusKeywords: [
      "kesinleşmemiş boşanma",
      "boşanma davası ve ölüm",
      "mirasçılık",
      "eş sıfatı",
      "genel hukuki değerlendirme"
    ],
    internalLinks: [
      "/bosanma-sureci/",
      "/miras-hukuku/",
      "/mal-paylasimi/",
      "/vasiyetname/",
      "/aile-hukuku/"
    ],
    objective: `Merak uyandırıcı ama clickbait olmayan başlık tonuyla; kesinleşme, miras, kusur tartışmalarının genel çerçevesi, sağ kalan eşin durumu. Kesin sonuç vaat etme; somut dosya vurgusu yap.`
  },
  {
    title: "Bir WhatsApp Mesajı Mahkemede Delil Olabilir mi?",
    slug: "whatsapp-mesaji-mahkemede-delil",
    focusKeywords: [
      "WhatsApp delil",
      "ekran görüntüsü delil",
      "hukuka aykırı delil",
      "özel hayatın gizliliği",
      "HMK"
    ],
    internalLinks: [
      "/delil-hukuku/",
      "/bosanma-delil/",
      "/is-hukuku-davalarinda-delil/",
      "/aile-hukuku/",
      "/kvkk/"
    ],
    objective: `WhatsApp yazışmaları, ekran görüntüsü, delilin hukuka aykırılığı, özel hayat; aile ve iş davalarında kullanımı genel bilgilendirme ile anlat.`
  }
];

const AI_LAWYER_ARTICLES = [
  {
    title: "Avukatlar İçin Yapay Zekâ: Hukuki Çerçeve, Riskler ve Uygulama Rehberi",
    slug: "avukatlar-icin-yapay-zeka-hukuk-rehberi",
    focusKeywords: [
      "avukatlar için yapay zeka",
      "legaltech avukat",
      "yapay zeka hukuk",
      "avukatlık meslek etiği yapay zeka",
      "hukukportali.com"
    ],
    internalLinks: [
      "/analizler/yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri",
      "/rehber/dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
      "/analizler/yapay-zeka-avukat-sorumlulugu",
      "/haber/yapay-zeka-avukatsiz-dava-dilekcesi",
      "/rehber/"
    ],
    objective: `Ana hub makale: avukatlıkta yapay zekâ kullanımı, mesleki özen, ofis politikası, riskler. İki pillar makaleye iç link ver: mesleki sır/KVKK analizi ve dilekçe kontrol listesi rehberi. LegalTech dilinde bilgilendirme; uydurma karar yok.`
  },
  {
    title: "Yapay Zekâ Çıktıları: Meslekî Sır, Kişisel Veri ve Baro Perspektifinden Genel Çerçeve",
    slug: "yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri",
    focusKeywords: [
      "yapay zeka mesleki sır",
      "avukat kişisel veri",
      "yapay zeka KVKK",
      "hukuk bürosu veri güvenliği",
      "hukukportali.com"
    ],
    internalLinks: [
      "/rehber/avukatlar-icin-yapay-zeka-hukuk-rehberi",
      "/rehber/dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
      "/analizler/yapay-zeka-avukat-sorumlulugu",
      "/aile-hukuku/",
      "/rehber/"
    ],
    objective: `Pillar analiz: üçüncü taraf AI araçlarına veri aktarımı, mesleki sırrın korunması, KVKK, anonimleştirme sınırları. Hub makaleye geri link.`
  },
  {
    title: "Dilekçe ve Araştırmada Yapay Zekâ: Avukat Kontrol Listesi",
    slug: "dilekce-ve-arastirmada-yapay-zeka-kontrol-listesi",
    focusKeywords: [
      "yapay zeka dilekçe",
      "dilekçe taslağı yapay zeka",
      "hukuki araştırma yapay zeka",
      "avukat kontrol listesi",
      "hukukportali.com"
    ],
    internalLinks: [
      "/rehber/avukatlar-icin-yapay-zeka-hukuk-rehberi",
      "/analizler/yapay-zeka-ciktilari-mesleki-sir-ve-kisisel-veri",
      "/analizler/yapay-zeka-avukat-sorumlulugu",
      "/delil-hukuku/",
      "/rehber/"
    ],
    objective: `Pillar rehber: AI taslak dilekçe ve araştırmada olay-talep uyumu, delil, mevzuat doğrulama, etik. Tablo ve madde listesi. Hub ve analiz pillar'a link.`
  }
];

const ARTICLES = AI_LAWYER_ONLY ? AI_LAWYER_ARTICLES : CEREN_ARTICLES;

function loadEnvFile() {
  let source = "";
  try {
    source = readFileSync(resolve(".env"), "utf8");
  } catch {
    return;
  }

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
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function pickGeminiApiKey() {
  const keyName =
    (process.env.GEMINI_API_KEY && "GEMINI_API_KEY") ||
    (process.env.GOOGLE_GEMINI_API_KEY && "GOOGLE_GEMINI_API_KEY") ||
    (process.env.GOOGLE_GENERATIVE_AI_API_KEY && "GOOGLE_GENERATIVE_AI_API_KEY");

  if (!keyName) {
    throw new Error(
      "Gemini API anahtarı bulunamadı. .env içinde GEMINI_API_KEY, GOOGLE_GEMINI_API_KEY veya GOOGLE_GENERATIVE_AI_API_KEY tanımlayın."
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
  if (found) {
    throw new Error(`Yasak ifade bulundu: "${found}"`);
  }
}

function stripFixedTail(text) {
  let body = String(text || "");
  const cta = getFixedCta();
  if (body.includes(cta)) body = body.replace(cta, "");
  if (body.includes(DISCLAIMER)) body = body.replace(DISCLAIMER, "");
  return body;
}

const BANNED_PERSONAL_NAMES = [/Avukat Ceren Sümer Cilli/i, /Ceren Sümer Cilli/i, /cerensumer\.av\.tr/i];

function ensureNoPersonalPromotion(text) {
  const body = stripFixedTail(text);
  const hit = BANNED_PERSONAL_NAMES.find((re) => re.test(body));
  if (hit) {
    throw new Error(`Kişisel tanıtım ifadesi bulundu: ${hit}`);
  }
}

function extractJson(text) {
  const trimmed = text.trim();
  const clean = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(clean);
}

/** Model bazen markdown gövdesini kod çiti içinde verir */
function stripOuterCodeFence(text) {
  const t = text.trim();
  if (!t.startsWith("```")) return t;
  return t.replace(/^```[a-z0-9_-]*\s*/i, "").replace(/\s*```$/i, "").trim();
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
    "conclusion"
  ];
  for (const key of required) {
    if (article[key] === undefined || article[key] === null) {
      throw new Error(`Eksik alan: ${key}`);
    }
  }
  if (!Array.isArray(article.alternativeTitles) || article.alternativeTitles.length !== 3) {
    throw new Error("alternativeTitles tam 3 öğe olmalı.");
  }
  if (!Array.isArray(article.faq) || article.faq.length < 5) {
    throw new Error("faq en az 5 soru içermeli.");
  }
  if (!Array.isArray(article.internalLinks) || article.internalLinks.length < 5) {
    throw new Error("internalLinks en az 5 öğe olmalı.");
  }
  if (!Array.isArray(article.externalSourceSuggestions) || article.externalSourceSuggestions.length < 3) {
    throw new Error("externalSourceSuggestions en az 3 öğe olmalı.");
  }
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
  if (!Array.isArray(meta.alternativeTitles) || meta.alternativeTitles.length !== 3) {
    throw new Error("alternativeTitles tam 3 öğe olmalı.");
  }
  if (!Array.isArray(meta.faq) || meta.faq.length < 5) {
    throw new Error("faq en az 5 soru içermeli.");
  }
  if (!Array.isArray(meta.internalLinks) || meta.internalLinks.length < 5) {
    throw new Error("internalLinks en az 5 öğe olmalı.");
  }
  if (!Array.isArray(meta.externalSourceSuggestions) || meta.externalSourceSuggestions.length < 3) {
    throw new Error("externalSourceSuggestions en az 3 öğe olmalı.");
  }
}

function normalizeArticle(article) {
  const normalized = { ...article };
  if (!Array.isArray(normalized.focusKeywords) && typeof normalized.focusKeywords === "string") {
    normalized.focusKeywords = normalized.focusKeywords
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return normalized;
}

function buildMarkdown(article) {
  const lines = [];
  lines.push(`# ${article.title}`, "");
  lines.push("## SEO başlığı", "", article.title, "");
  lines.push("## Alternatif başlıklar", "");
  for (const t of article.alternativeTitles) {
    lines.push(`- ${t}`);
  }
  lines.push("", "## Meta", "");
  lines.push(`- **Meta title:** ${article.metaTitle}`);
  lines.push(`- **Meta description:** ${article.metaDescription}`);
  lines.push(`- **URL slug:** ${article.slug}`);
  lines.push("", "## Anahtar kelimeler", "");
  lines.push(`- **Odak:** ${article.focusKeyword || article.focusKeywords[0]}`);
  lines.push(`- **Yardımcı:** ${(article.helperKeywords || []).join(", ")}`);
  lines.push("", "## İç link önerileri", "");
  for (const link of article.internalLinks) {
    lines.push(`- ${link}`);
  }
  lines.push("", "## Dış kaynak / kontrol önerileri", "");
  for (const s of article.externalSourceSuggestions) {
    lines.push(`- ${s}`);
  }
  lines.push("", "## Kategori ve etiketler", "");
  lines.push(`- **Kategori:** ${article.category}`);
  lines.push(`- **Etiketler:** ${(article.tags || []).join(", ")}`);
  lines.push("", "## Öne çıkan görsel önerisi", "", article.featuredImageSuggestion, "");
  lines.push("## Sosyal medya metni", "", article.socialShareText, "");
  lines.push("---", "", article.excerpt, "", article.content.trim(), "");
  lines.push("## Sık sorulan sorular", "");
  for (const item of article.faq) {
    lines.push(`### ${item.question}`, "", `${item.answer}`, "");
  }
  lines.push("## Sonuç", "", article.conclusion.trim(), "");
  return lines.join("\n");
}

function buildMetadataPrompt(spec) {
  const primaryKw = spec.focusKeywords[0];
  return `
${COMMON_METADATA_INSTRUCTIONS}

MAKALE ÖZEL TALİMATI:
Başlık: ${spec.title}
Beklenen slug: ${spec.slug}
Odak kelimeler: ${spec.focusKeywords.join(", ")}
İç link listesi (JSON'da aynen kullan): ${spec.internalLinks.join(", ")}
Amaç: ${spec.objective}

ÇIKTIYI SADECE GEÇERLİ JSON OLARAK VER. "content" alanı EKLEME.

JSON şeması:
{
  "title": "",
  "slug": "${spec.slug}",
  "metaTitle": "≤60 karakter",
  "metaDescription": "≤155 karakter",
  "alternativeTitles": ["", "", ""],
  "focusKeyword": "${primaryKw}",
  "focusKeywords": ${JSON.stringify(spec.focusKeywords)},
  "helperKeywords": [],
  "internalLinks": ${JSON.stringify(spec.internalLinks)},
  "externalSourceSuggestions": ["", "", ""],
  "category": "",
  "tags": [],
  "featuredImageSuggestion": "",
  "socialShareText": "",
  "excerpt": "2-3 cümle özet",
  "faq": [ { "question": "", "answer": "" } ],
  "conclusion": "Sonuç özeti (WordPress/kart için)"
}
faq en az 5 öğe olsun.
  `.trim();
}

function buildBodyMarkdownPrompt(spec, meta) {
  return `
${getCommonBodyInstructions()}

BAĞLAM (meta veriden; tutarlı ol):
Başlık: ${meta.title}
Slug: ${spec.slug}
Özet: ${meta.excerpt}
Odak kelime: ${meta.focusKeyword || spec.focusKeywords[0]}
Odak listesi: ${(meta.focusKeywords || spec.focusKeywords).join(", ")}
Sonuç özeti (H2 Sonuç ile uyumlu kısa kapanış yaz): ${meta.conclusion}

MAKALE ÖZEL TALİMATI:
${spec.objective}
  `.trim();
}

async function generateJson(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ json: true, temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini boş yanıt verdi.");
  }
  return text;
}

async function generatePlainText(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: buildGeminiGenerateConfig({ temperature: 0.65 })
  });
  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini boş metin verdi.");
  }
  return appendSourcesMarkdown(text, extractGroundingFromGenaiResponse(response));
}

async function fixJson(ai, rawText) {
  const capped =
    rawText.length > 120_000 ? `${rawText.slice(0, 120_000)}\n/* ... çıktı kesildi ... */` : rawText;
  const repairPrompt = `
Bu çıktı geçerli JSON değil. Açıklama eklemeden sadece geçerli JSON döndür.
Yapıyı ve alan adlarını koru; içerikleri mümkün olduğunca aynı tut.
Hatalı çıktı:
${capped}
  `.trim();
  return generateJson(ai, repairPrompt);
}

async function parseJsonWithRepair(ai, raw, attempts = 5) {
  let last = raw;
  for (let i = 0; i < attempts; i++) {
    try {
      return extractJson(last);
    } catch (err) {
      if (i === attempts - 1) {
        throw new Error(`JSON çözülemedi: ${err.message}`);
      }
      last = await fixJson(ai, last);
    }
  }
}

async function enforceWordWindow(ai, article) {
  let current = { ...article };
  let words = countWords(current.content);
  let tries = 0;

  while ((words < MIN_WORDS || words > MAX_WORDS) && tries < 5) {
    const direction =
      words < MIN_WORDS
        ? `Mevcut gövde ${words} kelime. ${MIN_WORDS}-${MAX_WORDS} aralığına çıkar. Tablo/liste ile genişletebilirsin.`
        : `Mevcut gövde ${words} kelime. ${MIN_WORDS}-${MAX_WORDS} aralığına indir. Tekrarları kırp.`;

    const revisePrompt = `
Sadece geçerli JSON döndür; tek alan: "content" (markdown string).
${direction}
Kişisel avukat/büro adı kullanma.
Sonunda bilgilendirme uyarısı + CTA paragrafları kalsın (kelimesi kelimesine CTA).

Mevcut content:
${current.content}
    `.trim();

    const revisedRaw = await generateJson(ai, revisePrompt);
    let parsed;
    try {
      parsed = extractJson(revisedRaw);
    } catch {
      const fixed = await fixJson(ai, revisedRaw);
      parsed = extractJson(fixed);
    }
    if (typeof parsed.content !== "string" || !parsed.content.trim()) {
      throw new Error("Kelime düzeltmesi geçersiz content döndürdü.");
    }
    current = { ...current, content: parsed.content.trim() };
    words = countWords(current.content);
    tries += 1;
  }

  return { article: current, words };
}


function assertMetaLengths(article) {
  if (article.metaTitle.length > 60) {
    console.warn(`Uyarı: metaTitle ${article.metaTitle.length} karakter (>60): ${article.slug}`);
  }
  if (article.metaDescription.length > 155) {
    console.warn(`Uyarı: metaDescription ${article.metaDescription.length} karakter (>155): ${article.slug}`);
  }
}

/** SEO alanlarını sert sınıra çeker (model taşarsa) */
function clampText(s, max) {
  const t = String(s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim();
}

async function generateOneArticle(ai, spec) {
  console.log("  → Meta + SSS (JSON)…");
  const metaRaw = await generateJson(ai, buildMetadataPrompt(spec));
  const meta = normalizeArticle(await parseJsonWithRepair(ai, metaRaw));
  validateMetadataShape(meta);
  meta.slug = spec.slug;
  meta.metaTitle = clampText(meta.metaTitle, 60);
  meta.metaDescription = clampText(meta.metaDescription, 155);

  console.log("  → Gövde (Markdown)…");
  const bodyMd = stripOuterCodeFence(await generatePlainText(ai, buildBodyMarkdownPrompt(spec, meta)));
  let article = normalizeArticle({ ...meta, content: bodyMd.trim() });
  validateArticleShape(article);

  const revised = await enforceWordWindow(ai, article);
  article = normalizeArticle(revised.article);
  let words = revised.words;
  words = countWords(article.content);
  validateArticleShape(article);

  ensureNoBannedPhrases(article.content);
  ensureNoPersonalPromotion(article.content);

  if (words < MIN_WORDS || words > MAX_WORDS) {
    throw new Error(`Kelime aralığı sağlanamadı (${words}). Makale: ${spec.slug}`);
  }

  assertMetaLengths(article);
  return { article, words };
}

function saveArticleFiles(article) {
  const base = resolve(OUTPUT_DIR, article.slug);
  writeFileSync(`${base}.json`, `${JSON.stringify(article, null, 2)}\n`, "utf8");
  writeFileSync(`${base}.md`, buildMarkdown(article), "utf8");
}

async function main() {
  loadEnvFile();
  const { keyName, keyValue } = pickGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey: keyValue });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const force = process.argv.includes("--force");

  console.log(`Gemini anahtarı: ${keyName}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Makale adedi: ${ARTICLES.length}`);
  if (force) console.log("Mod: --force (mevcut dosyaların üzerine yazılır)");

  const report = [];
  for (const spec of ARTICLES) {
    const jsonPath = resolve(OUTPUT_DIR, `${spec.slug}.json`);
    const mdPath = resolve(OUTPUT_DIR, `${spec.slug}.md`);
    if (!force && existsSync(jsonPath) && existsSync(mdPath)) {
      const existing = JSON.parse(readFileSync(jsonPath, "utf8"));
      report.push({
        title: existing.title,
        slug: existing.slug,
        words: countWords(existing.content || ""),
        status: "already_exists_skipped"
      });
      console.log(`\nAtlandı (zaten var): ${spec.slug} — yenilemek için: node scripts/generate-gemini-ceren-5.mjs --force`);
      continue;
    }

    console.log(`\nÜretiliyor: ${spec.slug}`);
    const { article, words } = await generateOneArticle(ai, spec);
    saveArticleFiles(article);

    report.push({
      title: article.title,
      slug: article.slug,
      words,
      status: "saved_json_md"
    });
    console.log(`Kaydedildi: ${spec.slug} (${words} kelime)`);
  }

  const reportPath = resolve(
    OUTPUT_DIR,
    AI_LAWYER_ONLY ? "generation-report-ai-lawyer.json" : "generation-report-ceren-5.json"
  );
  writeFileSync(`${reportPath}`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nRapor: ${reportPath}`);
}

main().catch((error) => {
  console.error("\nHATA:", error.message);
  process.exit(1);
});
