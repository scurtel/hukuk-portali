#!/usr/bin/env node
/**
 * Otomatik hukuk makalesi üretimi (Gemini → generated-articles → publish → build).
 * GitHub Actions: .github/workflows/auto-article.yml
 */
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { GoogleGenAI } from "@google/genai";

const ROOT = resolve(import.meta.dirname, "..");
const GENERATED_DIR = resolve(ROOT, "generated-articles");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MIN_WORDS = 900;
const MAX_WORDS = 1400;
const PROMPT_WORD_MIN = 1000;
const PROMPT_WORD_MAX = 1300;

const BANNED_PHRASES = [
  "en iyi avukat",
  "en başarılı avukat",
  "garantili sonuç",
  "kesin kazanılır",
  "garanti sonuç",
  "kesin süre",
  "en hızlı çözüm",
  "mutlaka bizimle çalışın"
];

const DISCLAIMER =
  "Bu içerik genel bilgilendirme amacıyla hazırlanmıştır; somut olay için hukuki danışmanlık alınmalıdır.";

const PLATFORM_CTA =
  "Somut uyuşmazlıklarda dosyanın özelliklerine göre değerlendirme değişebilir; Adana ve çevresinde aile, boşanma ve gayrimenkul alanlarında Avukat Ceren Sümer Cilli ile iletişime geçmek isteyenler hukukportali.com üzerinden bilgi alabilir.";

/** Konu havuzu — matchPatterns: mevcut makale slug/başlığında varsa konu atlanır */
const TOPIC_POOL = [
  { topic: "Aile hukuku nedir?", category: "Aile Hukuku", type: "rehber", matchPatterns: [/aile hukuku/i, /aile-hukuku/] },
  { topic: "Aile hukukunda en sık açılan davalar", category: "Aile Hukuku", type: "rehber", matchPatterns: [/aile hukukunda.*dava/i, /sik.*acilan.*dava/i] },
  { topic: "Boşanma davası nasıl açılır?", category: "Boşanma Hukuku", type: "rehber", matchPatterns: [/bosanma davasi nasil/i, /bosanma-davasi-nasil/] },
  { topic: "Anlaşmalı boşanma şartları", category: "Boşanma Hukuku", type: "rehber", matchPatterns: [/anlasmali bosanma/i, /anlasmali-bosanma/] },
  { topic: "Çekişmeli boşanma davası", category: "Boşanma Hukuku", type: "analiz", matchPatterns: [/cekismeli bosanma/i, /cekismeli-bosanma/] },
  { topic: "Velayet davasında hakim nelere dikkat eder?", category: "Velayet", type: "rehber", matchPatterns: [/velayet.*hakim/i, /velayet-davasinda-hakim/] },
  { topic: "Nafaka türleri nelerdir?", category: "Nafaka", type: "rehber", matchPatterns: [/nafaka tur/i, /nafaka-turleri/] },
  { topic: "İştirak nafakası nasıl belirlenir?", category: "Nafaka", type: "rehber", matchPatterns: [/istirak nafaka/i, /istirak-nafaka/] },
  { topic: "Yoksulluk nafakası şartları", category: "Nafaka", type: "rehber", matchPatterns: [/yoksulluk nafaka/i, /yoksulluk-nafaka/] },
  { topic: "Mal paylaşımı davası nedir?", category: "Mal Paylaşımı", type: "rehber", matchPatterns: [/mal paylasim/i, /mal-paylasim/] },
  { topic: "Boşanmada ziynet alacağı", category: "Boşanma Hukuku", type: "analiz", matchPatterns: [/ziynet alacak/i, /ziynet-alacagi/] },
  { topic: "Boşanmada maddi ve manevi tazminat", category: "Boşanma Hukuku", type: "analiz", matchPatterns: [/maddi.*manevi tazminat/i, /bosanmada.*tazminat/] },
  { topic: "Boşanma davasında telefon kayıtları", category: "Boşanma Hukuku", type: "analiz", matchPatterns: [/telefon kayit/i, /bosanmada.*telefon/] },
  { topic: "Boşanma davasında WhatsApp kayıtları", category: "Boşanma Hukuku", type: "analiz", matchPatterns: [/whatsapp.*bosanma/i, /whatsapp.*delil/] },
  { topic: "Boşanma davasında tanık beyanı", category: "Boşanma Hukuku", type: "rehber", matchPatterns: [/tanik beyan/i, /bosanmada.*tanik/] },
  { topic: "Boşanmada kusur nedir?", category: "Boşanma Hukuku", type: "rehber", matchPatterns: [/bosanmada kusur/i, /bosanma.*kusur/] },
  { topic: "Çocuğu göstermeme halinde ne yapılır?", category: "Velayet", type: "rehber", matchPatterns: [/cocugu gostermeme/i, /cocuk.*gostermeme/] },
  { topic: "Kişisel ilişki düzenlemesi", category: "Velayet", type: "rehber", matchPatterns: [/kisisel iliski/i, /kisisel-iliski/] },
  { topic: "Uzaklaştırma kararı nasıl alınır?", category: "Aile Hukuku", type: "rehber", matchPatterns: [/uzaklastirma karar/i, /uzaklastirma-karari/] },
  { topic: "Aile içi şiddet ve koruma tedbirleri", category: "Aile Hukuku", type: "rehber", matchPatterns: [/aile ici siddet/i, /koruma tedbir/] },
  { topic: "Tanıma ve tenfiz davası", category: "Aile Hukuku", type: "rehber", matchPatterns: [/tanima.*tenfiz/i, /tanima-tenfiz/] },
  { topic: "Miras hukuku nedir?", category: "Miras Hukuku", type: "rehber", matchPatterns: [/miras hukuku nedir/i, /miras-hukuku-nedir/] },
  { topic: "Miras paylaşımı nasıl yapılır?", category: "Miras Hukuku", type: "rehber", matchPatterns: [/miras paylasim/i, /miras-paylasim/] },
  { topic: "Saklı pay ve tenkis davası", category: "Miras Hukuku", type: "analiz", matchPatterns: [/sakli pay/i, /tenkis davasi/] },
  { topic: "Tapu iptal ve tescil davası", category: "Gayrimenkul Hukuku", type: "analiz", matchPatterns: [/tapu iptal.*tescil/i, /tapu-iptal/] },
  { topic: "Kira uyuşmazlıkları", category: "Kira Hukuku", type: "rehber", matchPatterns: [/kira uyusmazlik/i, /kira-uyusmazlik/] },
  { topic: "Tahliye davası", category: "Kira Hukuku", type: "rehber", matchPatterns: [/tahliye davasi/i, /tahliye-davasi/] },
  { topic: "İşçilik alacakları", category: "İş Hukuku", type: "rehber", matchPatterns: [/iscilik alacak/i, /iscilik-alacak/] },
  { topic: "Arabuluculuk nedir?", category: "Genel Hukuk", type: "rehber", matchPatterns: [/arabuluculuk nedir/i, /arabuluculuk-nedir/] },
  { topic: "Tüketici uyuşmazlıkları", category: "Tüketici Hukuku", type: "rehber", matchPatterns: [/tuketici uyusmazlik/i, /tuketici-uyusmazlik/] },
  { topic: "Hukuki danışmanlık neden önemlidir?", category: "Genel Hukuk", type: "rehber", matchPatterns: [/hukuki danismanlik neden/i, /hukuki-danismanlik/] },
  { topic: "Dava dilekçesi hazırlanırken nelere dikkat edilir?", category: "Genel Hukuk", type: "rehber", matchPatterns: [/dava dilekcesi hazirlan/i, /dilekce hazirlan/] },
  { topic: "Delil sunma süreci nasıl işler?", category: "Genel Hukuk", type: "rehber", matchPatterns: [/delil sunma/i, /delil-sunma/] },
  { topic: "İhtarname nedir ve ne işe yarar?", category: "Genel Hukuk", type: "rehber", matchPatterns: [/ihtarname nedir/i, /ihtarname-nedir/] }
];

const COMMON_RULES = `
Uydurma Yargıtay/AYM kararı numarası, sahte tarih veya doğrulanmamış kesin yürürlük iddiası kullanma.
"En iyi avukat", "garanti sonuç", "kesin kazanılır", "en hızlı çözüm" gibi reklam/vaat ifadeleri kullanma.
Kesin hukuki sonuç, garanti başarı veya kesin süre vaat etme.
Bilgilendirici, sade ve güven veren dil kullan.
`.trim();

function loadEnvFile() {
  try {
    const source = readFileSync(resolve(ROOT, ".env"), "utf8");
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
    /* .env yok — CI secret kullanılır */
  }
}

function pickGeminiApiKey() {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }
  return key;
}

function countWords(text) {
  return String(text || "")
    .replace(/[#*_`>\-\[\]\(\)|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
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

function clampText(s, max) {
  const t = String(s || "").trim();
  return t.length <= max ? t : t.slice(0, max).trim();
}

function ensureNoBannedPhrases(text) {
  const lowered = text.toLocaleLowerCase("tr");
  const found = BANNED_PHRASES.find((p) => lowered.includes(p.toLocaleLowerCase("tr")));
  if (found) throw new Error(`Yasak ifade: "${found}"`);
}

function slugify(text) {
  return text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function loadExistingArticles() {
  const articles = [];
  if (!existsSync(GENERATED_DIR)) return articles;

  for (const file of readdirSync(GENERATED_DIR)) {
    if (!file.endsWith(".json") || file.startsWith("generation-report") || file === "auto-last-run.json") {
      continue;
    }
    try {
      const data = JSON.parse(readFileSync(resolve(GENERATED_DIR, file), "utf8"));
      if (data?.slug && data?.title) {
        articles.push({ slug: data.slug, title: data.title, type: data.type || "rehber" });
      }
    } catch {
      /* atla */
    }
  }
  return articles;
}

function isTopicCovered(spec, articles) {
  const bag = articles.map((a) => `${a.slug} ${a.title}`).join(" ").toLocaleLowerCase("tr");
  return spec.matchPatterns.some((re) => re.test(bag));
}

function pickTopic(articles) {
  const available = TOPIC_POOL.filter((t) => !isTopicCovered(t, articles));
  const pool = available.length > 0 ? available : TOPIC_POOL;

  const dayKey = new Date().toISOString().slice(0, 10);
  const hash = dayKey.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

function buildLinkCatalog(articles) {
  return articles.map((a) => {
    const prefix = a.type === "analiz" ? "/analizler" : a.type === "haber" ? "/haber" : "/rehber";
    return { path: `${prefix}/${a.slug}`, slug: a.slug, title: a.title, type: a.type };
  });
}

function findRelatedLinks(topicSpec, catalog, limit = 8) {
  const topicWords = topicSpec.topic
    .toLocaleLowerCase("tr")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const scored = catalog.map((item) => {
    const bag = `${item.slug} ${item.title}`.toLocaleLowerCase("tr");
    let score = 0;
    for (const w of topicWords) {
      if (bag.includes(w)) score += 1;
    }
    return { item, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item.path);
}

function sanitizeMarkdownLinks(content, validPaths) {
  const valid = new Set(validPaths);
  return content.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (match, label, path) => {
    const normalized = path.split("#")[0];
    return valid.has(normalized) ? match : label;
  });
}

function filterInternalLinks(links, validPaths) {
  const valid = new Set(validPaths);
  return (links || []).filter((l) => typeof l === "string" && valid.has(l.split("#")[0]));
}

async function generateJson(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.65, responseMimeType: "application/json" }
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş JSON yanıtı.");
  return text;
}

async function generatePlainText(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.65 }
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Gemini boş metin yanıtı.");
  return text;
}

async function parseJsonWithRepair(ai, raw, attempts = 4) {
  let last = raw;
  for (let i = 0; i < attempts; i++) {
    try {
      return extractJson(last);
    } catch (err) {
      if (i === attempts - 1) throw err;
      const repair = await generateJson(
        ai,
        `Geçersiz JSON'u düzelt. Yalnızca geçerli JSON döndür:\n${last.slice(0, 100_000)}`
      );
      last = repair;
    }
  }
}

function buildMetadataPrompt(topicSpec, existingSlugs, suggestedLinks) {
  const today = new Date().toISOString().slice(0, 10);
  return `
Sen hukukportali.com için Türkçe hukuki içerik meta verisi üretiyorsun.
${COMMON_RULES}

KONU: ${topicSpec.topic}
KATEGORİ: ${topicSpec.category}
İÇERİK TİPİ: ${topicSpec.type}
BUGÜN: ${today}

Mevcut sluglar (BUNLARI KULLANMA): ${existingSlugs.join(", ")}

Önerilen iç linkler (varsa JSON internalLinks'e ekle; yoksa boş bırak):
${suggestedLinks.length ? suggestedLinks.join(", ") : "Uygun iç link yok"}

SEO:
- metaTitle: 55-60 karakter
- metaDescription: 145-160 karakter
- focusKeyword + focusKeywords (3-6)
- helperKeywords (4-8)
- Benzersiz URL slug (Türkçe, latin, tire ile; mevcut sluglarla çakışmasın)

Yalnızca geçerli JSON döndür (content alanı EKLEME):
{
  "title": "SEO uyumlu H1 başlık",
  "slug": "",
  "metaTitle": "",
  "metaDescription": "",
  "alternativeTitles": ["", "", ""],
  "focusKeyword": "",
  "focusKeywords": [],
  "helperKeywords": [],
  "internalLinks": [],
  "externalSourceSuggestions": ["", "", ""],
  "category": "${topicSpec.category}",
  "tags": [],
  "featuredImageSuggestion": "",
  "socialShareText": "",
  "excerpt": "2-3 cümle spot",
  "faq": [{ "question": "", "answer": "" }],
  "conclusion": "Kısa sonuç özeti"
}
faq en az 5 soru. tags en az 5 etiket.
  `.trim();
}

function buildBodyPrompt(topicSpec, meta, suggestedLinks) {
  return `
Sen hukukportali.com için Türkçe SEO uyumlu hukuk makalesi gövdesi yazıyorsun.
${COMMON_RULES}

Başlık: ${meta.title}
Slug: ${meta.slug}
Özet: ${meta.excerpt}
Odak kelime: ${meta.focusKeyword}
Kategori: ${topicSpec.category}

Kurallar:
- ${PROMPT_WORD_MIN}-${PROMPT_WORD_MAX} kelime (kabul edilen aralık: ${MIN_WORDS}-${MAX_WORDS})
- H1 kullanma (başlık ayrı); H2 ve H3 ile yapılandır
- Giriş paragrafı arama niyetine doğrudan cevap versin
- En az bir madde işaretli liste
- Keyword stuffing yapma
- Konu uygunsa Avukat Ceren Sümer Cilli'ye doğal, abartısız ve tek paragraflık yönlendirme ekle (reklam dili yok)
- Gövdede "Sık sorulan sorular" bölümü AÇMA (FAQ ayrı JSON'da)
- Sonunda H2 "Sonuç", ardından kısa bilgilendirme CTA paragrafı
- En sonda ayrı paragraf: "${DISCLAIMER}"

İç linkler (yalnızca bu path'ler varsa markdown link kullan; yoksa düz metin):
${suggestedLinks.length ? suggestedLinks.join(", ") : "Yok"}

Konu odağı: ${topicSpec.topic}

Yalnızca Markdown gövde döndür (JSON veya kod çiti yok).
  `.trim();
}

function buildBodyRetryPrompt(topicSpec, meta, suggestedLinks, { words, direction, previousContent }) {
  return `
Sen hukukportali.com için Türkçe hukuk makalesi gövdesini kelime sayısına göre düzeltiyorsun.
${COMMON_RULES}

Başlık: ${meta.title}
Konu: ${topicSpec.topic}

${direction}

Hedef kelime aralığı: ${PROMPT_WORD_MIN}-${PROMPT_WORD_MAX} (mutlak sınır: ${MIN_WORDS}-${MAX_WORDS})
Mevcut kelime sayısı: ${words}

Yapıyı koru (H2/H3, liste, Sonuç, disclaimer). Disclaimer cümlesi aynen kalsın:
"${DISCLAIMER}"

İç linkler (yalnızca varsa kullan): ${suggestedLinks.length ? suggestedLinks.join(", ") : "Yok"}

Mevcut metin:
---
${previousContent.slice(0, 80_000)}
---

Yalnızca düzeltilmiş Markdown gövde döndür.
  `.trim();
}

function isWordCountValid(words) {
  return words >= MIN_WORDS && words <= MAX_WORDS;
}

async function generateBodyWithRetry(ai, topicSpec, meta, suggestedLinks, validPaths) {
  let content = sanitizeMarkdownLinks(
    stripOuterCodeFence(await generatePlainText(ai, buildBodyPrompt(topicSpec, meta, suggestedLinks))).trim(),
    validPaths
  );
  let words = countWords(content);

  if (isWordCountValid(words)) {
    return content;
  }

  console.warn(`Kelime sayısı sınır dışı (${words}); gövde yeniden üretiliyor (1 deneme)…`);
  const direction =
    words > MAX_WORDS
      ? `Metin ${words} kelime; ${MAX_WORDS} kelimeyi geçmeyecek şekilde kısalt. Tekrarları ve gereksiz paragrafları çıkar.`
      : `Metin ${words} kelime; en az ${MIN_WORDS} kelime olacak şekilde genişlet.`;

  content = sanitizeMarkdownLinks(
    stripOuterCodeFence(
      await generatePlainText(
        ai,
        buildBodyRetryPrompt(topicSpec, meta, suggestedLinks, { words, direction, previousContent: content })
      )
    ).trim(),
    validPaths
  );
  words = countWords(content);

  if (!isWordCountValid(words)) {
    throw new Error(`Kelime sayısı uygun değil: ${words} (${MIN_WORDS}-${MAX_WORDS})`);
  }

  return content;
}

function validateMeta(meta) {
  if (!meta.title || !meta.slug || !meta.metaTitle || !meta.metaDescription) {
    throw new Error("Meta alanları eksik.");
  }
  if (!Array.isArray(meta.faq) || meta.faq.length < 5) {
    throw new Error("FAQ en az 5 soru olmalı.");
  }
  if (meta.metaTitle.length > 65) {
    console.warn(`metaTitle uzun (${meta.metaTitle.length}): kırpılıyor`);
    meta.metaTitle = clampText(meta.metaTitle, 60);
  }
  if (meta.metaDescription.length > 165) {
    console.warn(`metaDescription uzun (${meta.metaDescription.length}): kırpılıyor`);
    meta.metaDescription = clampText(meta.metaDescription, 160);
  }
}

function validateArticle(article, existingSlugs) {
  validateMeta(article);
  if (existingSlugs.has(article.slug)) {
    throw new Error(`Slug zaten mevcut: ${article.slug}`);
  }
  const words = countWords(article.content);
  if (!isWordCountValid(words)) {
    throw new Error(`Kelime sayısı uygun değil: ${words} (${MIN_WORDS}-${MAX_WORDS})`);
  }
  ensureNoBannedPhrases(`${article.title}\n${article.content}`);
  if (!article.content.includes(DISCLAIMER)) {
    throw new Error("Disclaimer metni gövdede yok.");
  }
}

function buildMarkdownFile(article) {
  const lines = [
    `# ${article.title}`,
    "",
    article.excerpt,
    "",
    article.content.trim(),
    "",
    "## Sık sorulan sorular",
    ""
  ];
  for (const item of article.faq) {
    lines.push(`### ${item.question}`, "", item.answer, "");
  }
  lines.push("## Sonuç", "", article.conclusion.trim(), "");
  return lines.join("\n");
}

function runCommand(label, cmd, args, cwd = ROOT) {
  console.log(`→ ${label}`);
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true });
  if (result.status !== 0) {
    throw new Error(`${label} başarısız (kod ${result.status ?? 1})`);
  }
}

function writeRunReport(article) {
  const report = {
    slug: article.slug,
    title: article.title,
    type: article.type,
    generatedAt: new Date().toISOString()
  };
  writeFileSync(resolve(GENERATED_DIR, "auto-last-run.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `slug=${article.slug}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, `title=${article.title}\n`);
  }
}

async function main() {
  loadEnvFile();
  const apiKey = pickGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey });
  mkdirSync(GENERATED_DIR, { recursive: true });

  console.log("Mevcut makaleler taranıyor…");
  const existing = loadExistingArticles();
  const existingSlugs = new Set(existing.map((a) => a.slug));
  const linkCatalog = buildLinkCatalog(existing);
  const validPaths = new Set(linkCatalog.map((l) => l.path));

  const topicSpec = pickTopic(existing);
  console.log(`Seçilen konu: ${topicSpec.topic}`);

  const suggestedLinks = findRelatedLinks(topicSpec, linkCatalog);

  console.log("Meta + FAQ üretiliyor…");
  const metaRaw = await generateJson(ai, buildMetadataPrompt(topicSpec, [...existingSlugs], suggestedLinks));
  const meta = await parseJsonWithRepair(ai, metaRaw);
  meta.slug = slugify(meta.slug || meta.title);
  if (existingSlugs.has(meta.slug)) {
    meta.slug = `${meta.slug}-${Date.now().toString(36).slice(-4)}`;
  }
  validateMeta(meta);

  console.log("Gövde üretiliyor…");
  const content = await generateBodyWithRetry(ai, topicSpec, meta, suggestedLinks, validPaths);

  const today = new Date().toISOString().slice(0, 10);
  const article = {
    ...meta,
    slug: meta.slug,
    type: topicSpec.type,
    featured: false,
    publishedAt: today,
    updatedAt: today,
    content,
    internalLinks: filterInternalLinks(meta.internalLinks, validPaths)
  };

  validateArticle(article, existingSlugs);

  const jsonPath = resolve(GENERATED_DIR, `${article.slug}.json`);
  const mdPath = resolve(GENERATED_DIR, `${article.slug}.md`);

  console.log(`Kaydediliyor: ${article.slug}`);
  writeFileSync(jsonPath, `${JSON.stringify(article, null, 2)}\n`, "utf8");
  writeFileSync(mdPath, buildMarkdownFile(article), "utf8");

  runCommand("Yayın verisi güncelleniyor", "node", ["scripts/publish-generated-articles.mjs"]);
  runCommand("Build doğrulanıyor", "npm", ["run", "build"]);

  writeRunReport(article);

  console.log("");
  console.log("=== Otomatik makale üretimi tamamlandı ===");
  console.log(`Slug: ${article.slug}`);
  console.log(`Dosya: generated-articles/${article.slug}.json`);
  console.log(`URL: /${article.type}/${article.slug}`);
  console.log(`Kelime: ${countWords(article.content)}`);
}

main().catch((err) => {
  console.error("HATA:", err.message || err);
  process.exit(1);
});
