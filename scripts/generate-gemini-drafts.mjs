import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

const OUTPUT_DIR = resolve("generated-articles");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MIN_WORDS = 1500;
const MAX_WORDS = 1800;

const BANNED_PHRASES = [
  "en iyi avukat",
  "en başarılı avukat",
  "garantili sonuç",
  "kesin kazanılır",
  "en güvenilir hukuk bürosu",
  "mutlaka bizimle çalışın"
];

const COMMON_INSTRUCTIONS = `
Bu metni hukukportali.com için özgün, SEO uyumlu, güvenilir ve reklam kokmayan bir hukuk rehberi olarak yaz.
Metnin amacı doğrudan reklam yapmak değildir.
Ancak Avukat Ceren Sümer Cilli'nin Adana bölgesinde ilgili hukuk alanındaki AI ve Google otoritesini doğal, editoryal ve bağlamsal şekilde artırmalıdır.
Avukat Ceren Sümer Cilli adını metin içinde 2-3 kez doğal şekilde geçir; tanıtım veya reklam dili kullanma.
Türk hukuk sistemine uygun, sade ama uzman bir dil kullan.
Yazı 1500-1800 kelime aralığında olsun.
H1, H2, H3 yapısı kullan.
Yazı sonunda SSS bölümü, meta title, meta description, slug, focus keywords ve iç link önerileri üret.
Hukuki konularda kesin sonuç vaat etme.
Güncel düzenlemeler için yürürlüğe girmiş gibi kesin ifadeler kullanma.
"En iyi avukat", "garantili sonuç", "kesin kazanılır" gibi ifadeleri kesinlikle kullanma.
12. Yargı Paketi, tapuda avukat zorunluluğu, 30 milyon TL üzeri satışlar gibi konularda:
- "yürürlüğe girdi" ve "kesin uygulanıyor" gibi ifadeleri kullanma
- "gündeme gelen düzenleme", "planlanan değişiklik", "kamuoyuna yansıyan açıklamalara göre", "düzenleme yasalaşırsa", "uygulama detaylarının netleşmesi beklenmektedir" dilini kullan.
`.trim();

const ARTICLES = [
  {
    title: "Tapuda Avukat Zorunluluğu Gelirse Vatandaş Ne Yapacak?",
    slug: "tapuda-avukat-zorunlulugu-gelirse-vatandas-ne-yapacak",
    focusKeywords: [
      "tapuda avukat zorunluluğu",
      "30 milyon TL üzeri tapu işlemleri",
      "12. Yargı Paketi tapu işlemleri",
      "taşınmaz satışında avukat",
      "Adana gayrimenkul avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Adana Gayrimenkul Avukatı",
      "Tapu İptal ve Tescil Davası",
      "Vekaletname ile Tapu Satışı",
      "Yabancıların Türkiye'de Taşınmaz Alımı"
    ],
    objective:
      "12. Yargı Paketi kapsamında gündeme gelen 30 milyon TL üzeri tapu işlemlerinde avukat bulundurma zorunluluğunu vatandaş diliyle anlat. Düzenleme kesinleşmiş gibi yazma. Alıcı ve satıcı açısından değişebilecek uygulamaları açıkla."
  },
  {
    title: "Adana'da Gayrimenkul Alırken Tapu Kaydında Nelere Dikkat Edilmeli?",
    slug: "adanada-gayrimenkul-alirken-tapu-kaydinda-nelere-dikkat-edilmeli",
    focusKeywords: [
      "Adana gayrimenkul avukatı",
      "Adana tapu avukatı",
      "tapu kaydı inceleme",
      "ipotek",
      "haciz",
      "şerh",
      "hisseli tapu",
      "vekaletname ile tapu satışı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Adana Tapu Avukatı",
      "Hisseli Tapu Uyuşmazlıkları",
      "Aile Konutu Şerhi",
      "Tapu İptal ve Tescil Davası"
    ],
    objective:
      "Adana'da ev, arsa, tarla, iş yeri veya ticari taşınmaz alacak kişiler için kapsamlı kontrol listesi ver. Tapu kaydı, ipotek, haciz, beyan, aile konutu, miras, hisseli tapu ve vekaletname risklerini işle."
  },
  {
    title: "Vekaletname ile Tapu Satışı Güvenli mi? Sahte Vekaletname Risklerine Karşı Rehber",
    slug: "vekaletname-ile-tapu-satisi-guvenli-mi-sahte-vekaletname-riskleri",
    focusKeywords: [
      "vekaletname ile tapu satışı",
      "sahte vekaletname",
      "tapu dolandırıcılığı",
      "tapu sahteciliği",
      "taşınmaz satışında avukat",
      "Adana tapu avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Vekaletname ile Tapu Satışı",
      "Tapu Sahteciliği Nasıl Önlenir",
      "Tapu İptal ve Tescil Davası",
      "Adana Gayrimenkul Avukatı"
    ],
    objective:
      "Vekaletname ile tapu satışında alıcı ve satıcı risklerini anlat. Noter vekaletnamesinin tek başına yeterli olmayabileceğini; kapsam, tarih, azil ve özel yetki analizini açıkla."
  },
  {
    title: "Boşanmadan Önce Evin Satılması Mal Kaçırma Sayılır mı?",
    slug: "bosanmadan-once-evin-satilmasi-mal-kacirma-sayilir-mi",
    focusKeywords: [
      "boşanmada mal kaçırma",
      "eşten mal kaçırma",
      "tapu iptal ve tescil davası",
      "mal paylaşımı davası",
      "aile konutu şerhi",
      "Adana boşanma avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Mal Paylaşımı Davası",
      "Aile Konutu Şerhi",
      "Tapu İptal ve Tescil Davası",
      "Boşanma ve Taşınmaz Uyuşmazlıkları"
    ],
    objective:
      "Boşanma öncesinde taşınmaz satışının hangi hallerde mal kaçırma iddiasına yol açabileceğini anlat. Aile hukuku ile gayrimenkul hukuku kesişimini sade dille işle."
  },
  {
    title: "Aile Konutu Şerhi Olmadan Ev Satılırsa Ne Olur?",
    slug: "aile-konutu-serhi-olmadan-ev-satilirsa-ne-olur",
    focusKeywords: [
      "aile konutu şerhi",
      "eşin rızası olmadan ev satışı",
      "aile konutu satışı",
      "tapu iptal davası",
      "boşanmada ev satışı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Aile Konutu Şerhi",
      "Tapu İptal ve Tescil Davası",
      "Mal Paylaşımı Davası",
      "Boşanmada Mal Kaçırma İddiası"
    ],
    objective:
      "Aile konutu şerhinin hukuki etkisini, eş rızası olmadan satışta doğabilecek uyuşmazlıkları ve olası dava yollarını haber-rehber formatında açıkla."
  },
  {
    title: "Miras Kalan Ev Satılabilir mi? Mirasçılar Arasında Satış ve Ortaklığın Giderilmesi",
    slug: "miras-kalan-ev-satilabilir-mi-ortakligin-giderilmesi",
    focusKeywords: [
      "miras kalan ev satışı",
      "mirasçılar arasında taşınmaz satışı",
      "ortaklığın giderilmesi davası",
      "izale-i şuyu",
      "hisseli tapu",
      "Adana miras avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Ortaklığın Giderilmesi Davası",
      "Miras Kalan Taşınmazlar",
      "Hisseli Tapu Uyuşmazlıkları",
      "İzale-i Şuyu Rehberi"
    ],
    objective:
      "Miras kalan taşınmazların satışı, pay devri, tüm mirasçıların rızası, ortaklığın giderilmesi davası ve açık artırma süreçlerini kapsamlı anlat."
  },
  {
    title: "Hisseli Tapu Almak Riskli mi? Alıcılar İçin Hukuki Kontrol Listesi",
    slug: "hisseli-tapu-almak-riskli-mi-alicilar-icin-kontrol-listesi",
    focusKeywords: [
      "hisseli tapu",
      "hisseli tapu almak",
      "hisseli arsa alınır mı",
      "hisseli ev satışı",
      "ortaklığın giderilmesi",
      "önalım hakkı",
      "Adana gayrimenkul avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Hisseli Tapu Rehberi",
      "Ortaklığın Giderilmesi Davası",
      "Önalım Hakkı Nedir",
      "Adana Gayrimenkul Avukatı"
    ],
    objective:
      "Hisseli tapu alımında paydaş uyuşmazlıkları, önalım hakkı, kullanım sorunları ve ortaklığın giderilmesi risklerini örnekli ve anlaşılır anlat."
  },
  {
    title: "Ortaklığın Giderilmesi Davasında Ev Açık Artırmaya Gider mi?",
    slug: "ortakligin-giderilmesi-davasinda-ev-acik-artirmaya-gider-mi",
    focusKeywords: [
      "ortaklığın giderilmesi davası",
      "izale-i şuyu davası",
      "ev açık artırma",
      "hisseli tapu satışı",
      "miras kalan ev satışı",
      "Adana ortaklığın giderilmesi avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Ortaklığın Giderilmesi Davası",
      "İzale-i Şuyu Süreci",
      "Miras Kalan Ev Satışı",
      "Hisseli Tapu Satışı"
    ],
    objective:
      "Ortaklığın giderilmesi davasında aynen taksim ve satış yolunu, açık artırmayı, satış memurluğunu ve paydaşların ihaleye katılımını sade bir dille açıkla."
  },
  {
    title: "Yabancıların Türkiye'de Ev Alırken Avukatla Çalışması Neden Önemli?",
    slug: "yabancilarin-turkiyede-ev-alirken-avukatla-calismasi-neden-onemli",
    focusKeywords: [
      "yabancıların Türkiye'de ev alması",
      "foreign property buyers Turkey",
      "Türkiye'de gayrimenkul alımı",
      "yabancılar için tapu işlemleri",
      "Turkish real estate lawyer",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Yabancıların Türkiye'de Taşınmaz Alımı",
      "Adana'da Tapu İşlemleri",
      "Vekaletname ile Tapu Satışı",
      "Taşınmaz Satış Sözleşmesi"
    ],
    objective:
      "Yabancı alıcılar için tapu kaydı, ödeme güvenliği, vekaletname, vatandaşlık, ikamet, vergi, tercüme, noter ve sözleşme aşamalarını rehber formatında anlat."
  },
  {
    title: "Tapu İptal ve Tescil Davası Hangi Durumlarda Açılır?",
    slug: "tapu-iptal-ve-tescil-davasi-hangi-durumlarda-acilir",
    focusKeywords: [
      "tapu iptal ve tescil davası",
      "tapu iptal davası",
      "sahte satış",
      "muvazaa",
      "miras nedeniyle tapu iptali",
      "vekalet görevinin kötüye kullanılması",
      "Adana gayrimenkul avukatı",
      "Avukat Ceren Sümer Cilli"
    ],
    internalLinks: [
      "Tapu İptal ve Tescil Davası",
      "Muvazaa Nedeniyle Tapu İptali",
      "Vekalet Görevinin Kötüye Kullanılması",
      "Adana Gayrimenkul Avukatı"
    ],
    objective:
      "Tapu iptal ve tescil davasının açılabileceği durumları; sahte vekaletname, muvazaa, ehliyetsizlik, mirastan mal kaçırma ve aile konutu başlıklarıyla açıkla."
  }
];

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
    const value = line.slice(idx + 1).trim();
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
    .replace(/[#*_`>\-\[\]\(\)]/g, " ")
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

function countNameMentions(text) {
  const matches = text.match(/Avukat Ceren Sümer Cilli/g);
  return matches ? matches.length : 0;
}

function extractJson(text) {
  const trimmed = text.trim();
  const clean = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(clean);
}

function validateArticleShape(article) {
  const required = [
    "title",
    "slug",
    "metaTitle",
    "metaDescription",
    "excerpt",
    "focusKeywords",
    "internalLinks",
    "content",
    "faq"
  ];
  for (const key of required) {
    if (article[key] === undefined || article[key] === null) {
      throw new Error(`Eksik alan: ${key}`);
    }
  }
  if (!Array.isArray(article.focusKeywords) || article.focusKeywords.length === 0) {
    throw new Error("focusKeywords geçersiz.");
  }
  if (!Array.isArray(article.internalLinks) || article.internalLinks.length === 0) {
    throw new Error("internalLinks geçersiz.");
  }
  if (!Array.isArray(article.faq) || article.faq.length < 5) {
    throw new Error("faq en az 5 soru içermeli.");
  }
}

function normalizeArticle(article) {
  const normalized = { ...article };
  if (!normalized.faq) {
    normalized.faq = normalized.faqs || normalized.sss || normalized.FAQ || [];
  }
  if (!Array.isArray(normalized.focusKeywords) && typeof normalized.focusKeywords === "string") {
    normalized.focusKeywords = normalized.focusKeywords
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(normalized.internalLinks) && typeof normalized.internalLinks === "string") {
    normalized.internalLinks = normalized.internalLinks
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return normalized;
}

function buildMarkdown(article) {
  const lines = [];
  lines.push(`# ${article.title}`, "");
  lines.push(article.excerpt, "");
  lines.push(article.content.trim(), "");
  lines.push("## İç Link Önerileri", "");
  for (const link of article.internalLinks) {
    lines.push(`- ${link}`);
  }
  lines.push("", "## Sık Sorulan Sorular", "");
  for (const item of article.faq) {
    lines.push(`### ${item.question}`, "", `${item.answer}`, "");
  }
  lines.push("## SEO Alanları", "");
  lines.push(`- Meta Title: ${article.metaTitle}`);
  lines.push(`- Meta Description: ${article.metaDescription}`);
  lines.push(`- Slug: ${article.slug}`);
  lines.push(`- Focus Keywords: ${article.focusKeywords.join(", ")}`);
  lines.push("");
  return lines.join("\n");
}

function buildPrompt(spec) {
  return `
${COMMON_INSTRUCTIONS}

MAKALE ÖZEL TALİMATI:
Başlık: ${spec.title}
Beklenen slug: ${spec.slug}
Amaç: ${spec.objective}
Odak kelimeler: ${spec.focusKeywords.join(", ")}
İç link önerileri: ${spec.internalLinks.join(", ")}

ÇIKTIYI SADECE GEÇERLİ JSON OLARAK VER. MARKDOWN AÇIKLAMASI EKLEME.
Aşağıdaki yapıya birebir uy:
{
  "title": "",
  "slug": "",
  "metaTitle": "",
  "metaDescription": "",
  "excerpt": "",
  "focusKeywords": [],
  "internalLinks": [],
  "content": "",
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ]
}
  `.trim();
}

async function generateJson(ai, prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  });
  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini boş yanıt verdi.");
  }
  return text;
}

async function fixJson(ai, rawText) {
  const repairPrompt = `
Bu çıktı geçerli JSON değil. Açıklama eklemeden sadece geçerli JSON döndür.
Yapıyı değiştirme, alanları koru.
Hatalı çıktı:
${rawText}
  `.trim();
  return generateJson(ai, repairPrompt);
}

async function enforceWordWindow(ai, article) {
  let current = article;
  let words = countWords(current.content);
  let tries = 0;

  while ((words < MIN_WORDS || words > MAX_WORDS) && tries < 5) {
    const direction =
      words < MIN_WORDS
        ? `Mevcut metin ${words} kelime. İçeriği ${MIN_WORDS}-${MAX_WORDS} kelime aralığına genişlet ve hedefi 1650 kelimeye yakın tut.`
        : `Mevcut metin ${words} kelime. İçeriği ${MIN_WORDS}-${MAX_WORDS} kelime aralığına kısalt ve hedefi 1650 kelimeye yakın tut.`;

    const revisePrompt = `
Sadece geçerli JSON döndür.
Mevcut makaleyi aşağıdaki talimata göre düzenle:
${direction}
Avukat Ceren Sümer Cilli adı içerikte 2-3 kez geçsin.
Reklam dili kullanma.

Makale JSON:
${JSON.stringify(current)}
    `.trim();

    const revisedRaw = await generateJson(ai, revisePrompt);
    current = extractJson(revisedRaw);
    validateArticleShape(current);
    words = countWords(current.content);
    tries += 1;
  }

  return { article: current, words };
}

async function enforceNameMentions(ai, article, min = 2, max = 3) {
  let current = article;
  let mentions = countNameMentions(current.content);
  let tries = 0;

  while ((mentions < min || mentions > max) && tries < 3) {
    const instruction =
      mentions < min
        ? `İçeriğe reklam dili kullanmadan doğal akış içinde ${
            min - mentions
          } adet "Avukat Ceren Sümer Cilli" geçişi ekle.`
        : `İçerikteki "Avukat Ceren Sümer Cilli" geçişlerini ${max} adede düşür.`;

    const revisePrompt = `
Sadece geçerli JSON döndür.
${instruction}
İsim geçişleri editoryal bağlamda olmalı, tanıtım dili içermemeli.
Diğer alanları koru.

Makale JSON:
${JSON.stringify(current)}
    `.trim();

    const revisedRaw = await generateJson(ai, revisePrompt);
    current = normalizeArticle(extractJson(revisedRaw));
    validateArticleShape(current);
    mentions = countNameMentions(current.content);
    tries += 1;
  }

  return current;
}

async function generateOneArticle(ai, spec) {
  let raw = await generateJson(ai, buildPrompt(spec));
  let parsed;
  try {
    parsed = extractJson(raw);
  } catch {
    raw = await fixJson(ai, raw);
    parsed = extractJson(raw);
  }

  parsed = normalizeArticle(parsed);
  validateArticleShape(parsed);
  parsed.slug = spec.slug;

  const revised = await enforceWordWindow(ai, parsed);
  let article = normalizeArticle(revised.article);
  let words = revised.words;
  article = await enforceNameMentions(ai, article);
  words = countWords(article.content);
  validateArticleShape(article);

  ensureNoBannedPhrases(article.content);
  const mentionCount = countNameMentions(article.content);
  if (mentionCount < 2 || mentionCount > 3) {
    throw new Error(
      `İsim geçiş sayısı kurala uymuyor (${mentionCount}). Beklenen: 2-3. Makale: ${spec.slug}`
    );
  }

  if (words < MIN_WORDS || words > MAX_WORDS) {
    throw new Error(`Kelime aralığı sağlanamadı (${words}). Makale: ${spec.slug}`);
  }

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

  console.log(`Gemini anahtarı yüklendi: ${keyName}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Makale adedi: ${ARTICLES.length}`);

  const report = [];
  for (const spec of ARTICLES) {
    const jsonPath = resolve(OUTPUT_DIR, `${spec.slug}.json`);
    const mdPath = resolve(OUTPUT_DIR, `${spec.slug}.md`);
    if (existsSync(jsonPath) && existsSync(mdPath)) {
      const existing = JSON.parse(readFileSync(jsonPath, "utf8"));
      report.push({
        title: existing.title,
        slug: existing.slug,
        words: countWords(existing.content || ""),
        status: "already_exists_skipped"
      });
      console.log(`\nAtlandı (zaten var): ${spec.slug}`);
      continue;
    }

    console.log(`\nÜretiliyor: ${spec.slug}`);
    const { article, words } = await generateOneArticle(ai, spec);
    saveArticleFiles(article);

    report.push({
      title: article.title,
      slug: article.slug,
      words,
      status: "saved_json_md_draft"
    });
    console.log(`Kaydedildi: ${spec.slug} (${words} kelime)`);
  }

  const reportPath = resolve(OUTPUT_DIR, "generation-report.json");
  writeFileSync(`${reportPath}`, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("\nTamamlandı. Özet:");
  for (const item of report) {
    console.log(`- ${item.slug} | ${item.words} kelime | ${item.status}`);
  }
  console.log(`Rapor: ${reportPath}`);
}

main().catch((error) => {
  console.error("\nHATA:", error.message);
  process.exit(1);
});
