import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

const ROOT = resolve(import.meta.dirname, "..");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const SLUG = "kayip-bitcoin-hikayeleri-kripto-varlik-hukuku";
const OUTPUT_JSON = resolve(ROOT, `generated-articles/${SLUG}.json`);
const OUTPUT_MD = resolve(ROOT, `generated-articles/${SLUG}.md`);

const DISCLAIMER =
  "Bu yazı genel bilgilendirme amacı taşır. Somut olaylarda hukuki değerlendirme, olayın özelliklerine ve yürürlükteki mevzuata göre yapılmalıdır.";

const FACT_BRIEF = `
Kamuoyuna yansıyan olay özetleri (haber ve genel medya kaynakları; kesin mahkeme kararı numarası uydurma):

1) James Howells (Galler / Newport):
- 2013'te yaklaşık 8.000 Bitcoin özel anahtarını içeren hard diski yanlışlıkla çöpe attığı iddia ediliyor.
- Diskin Newport Docksway çöp sahasına gittiği belirtiliyor.
- Yıllarca belediyeden kazı izni talebi; çevresel risk, maliyet ve başarı ihtimalinin düşük olması gerekçeleriyle reddedildiği aktarılıyor.
- Mahkeme süreçleri ve çöp sahasını satın alma girişimleri sonuçsuz kaldığı kamuoyuna yansıdı.
- Güncel piyasa değerleri bağlamında 8.000 BTC'nin çok yüksek (yüz milyonlarca dolar bandında) bir değere işaret edildiği ifade ediliyor; kesin rakam piyasaya göre değişir.

2) Stefan Thomas (Alman asıllı yazılımcı):
- 7.002 Bitcoin'in IronKey USB bellekte kilitli kaldığı; şifresini unuttuğu aktarılıyor.
- IronKey'in sınırlı hatalı şifre denemesinden sonra verileri erişilemez hale getirebildiği biliniyor.
- Uzun süre yalnızca birkaç deneme hakkı kaldığına dair haberler yer aldı.
- Özel anahtar / şifre kaybının fiilen servetin erişilemez hale gelmesi anlamına gelebileceğini gösteren sembolik örnek.
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
    /* .env yok */
  }
}

function countWords(text) {
  return String(text || "")
    .replace(/[#*_`>\-\[\]\(\)|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function stripFence(text) {
  return text.trim().replace(/^```(?:json|markdown|md)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

loadEnvFile();

const apiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY tanımlı değil (.env).");
}

const ai = new GoogleGenAI({ apiKey });

const META = {
  title: "Çöpe Atılan Bitcoin Serveti: Kayıp Kripto Varlıklar Hukuken Ne Anlama Geliyor?",
  slug: SLUG,
  metaTitle: "Kayıp Bitcoin Hikâyeleri ve Kripto Varlık Hukuku",
  metaDescription:
    "8.000 Bitcoin'i çöpe atılan hard disk ve şifresi unutulan 7.002 Bitcoin olayı üzerinden kripto varlık hukuku, dijital miras ve özel anahtar kaybı inceleniyor.",
  excerpt:
    "James Howells'in çöpe giden hard diski ve Stefan Thomas'ın kilitli USB'si, kripto varlıklarda özel anahtar kaybının hukuki ve pratik sonuçlarını gözler önüne seriyor.",
  focusKeyword: "kripto varlık hukuku",
  focusKeywords: [
    "kripto varlık hukuku",
    "kayıp bitcoin",
    "özel anahtar kaybı",
    "dijital miras",
    "kripto para mirası",
    "bitcoin hard disk hikayesi",
    "kripto varlıkların hukuki durumu",
    "soğuk cüzdan şifresi",
    "kripto para güvenliği"
  ],
  helperKeywords: [
    "James Howells",
    "Stefan Thomas",
    "IronKey",
    "soğuk cüzdan",
    "dijital miras planlaması",
    "mülkiyet hakkı",
    "ispat sorunu"
  ],
  faq: [
    {
      question: "Özel anahtarı kaybolan Bitcoin geri alınabilir mi?",
      answer: ""
    },
    {
      question: "Kripto paralar mirasa konu olur mu?",
      answer: ""
    },
    {
      question: "Mirasçılar ölen kişinin kripto varlıklarına ulaşabilir mi?",
      answer: ""
    },
    {
      question: "Soğuk cüzdan şifresi unutulursa ne olur?",
      answer: ""
    },
    {
      question: "Kripto varlıklar için dijital miras planlaması yapılmalı mı?",
      answer: ""
    }
  ]
};

async function generateBody() {
  const prompt = `
Sen hukukportali.com için Türkçe, SEO uyumlu ve bilgilendirici bir hukuk makalesi yazıyorsun.

${FACT_BRIEF}

KONU: Kayıp kripto varlıklar — James Howells ve Stefan Thomas hikâyeleri üzerinden kripto varlık hukuku.

KURALLAR:
- 1200-1600 kelime; Markdown gövde (H1 kullanma, başlık ayrı).
- Uydurma Yargıtay/AYM kararı numarası, sahte tarih veya doğrulanmamış kesin yürürlük iddiası kullanma.
- "En iyi avukat", garanti sonuç, kesin kazanılır, avukat reklamı yok.
- Haber kaynaklarına ve kamuya açık bilgilere dayandığını doğal şekilde belirt; somut olayların her biri kendi özelinde değerlendirilmelidir ifadesini doğal ekle.
- Kesin hukuki tavsiye dili kullanma; bilgilendirme tonu.

YAPI (H2 başlıkları aynen veya çok yakın):
## 8.000 Bitcoin'in Peşindeki Adam: James Howells'in Hikâyesi
## Şifresi Unutulan USB: Stefan Thomas'ın 7.002 Bitcoin'i
## Kripto Varlıklarda Asıl Değer Nerede? Coin'de mi, Anahtarda mı?
## Özel Anahtar Kaybolursa Hukuken Ne Olur?
## Dijital Malvarlığı ve Miras Hukuku Açısından Kripto Paralar
## Türkiye'de Kripto Varlıkların Hukuki Durumu
## Kripto Varlık Sahipleri Ne Yapmalı?
## Sonuç: Dijital Servetin En Zayıf Halkası İnsan Hatası

Giriş: Dramatik kısa giriş — "Bir hard disk, bir şifre, bir unutkanlık ve yüz milyonlarca dolarlık kayıp..." tarzında.

Türkiye hukuku açısından şu noktalara mutlaka değin:
- Kripto fiziki para gibi elde tutulmaz; erişim özel anahtar, cüzdan şifresi veya borsa hesabı üzerinden.
- Özel anahtarı kaybeden teknik sahiplik iddiası ile fiili erişimsizlik ayrımı.
- Mirasçıların erişememesi sorunu; terekeye dahil olma ile fiili tahsil zorluğu.
- Borsa hesaplarında KYC ve mirasçılık belgesi süreçleri; soğuk cüzdanda anahtar yoksa erişim çoğu zaman imkânsız.
- Dijital miras planlaması önemi.

Ana açılar: kripto para güvenliği, dijital miras, özel anahtar kaybı, mülkiyet hakkı, ispat sorunu, hukuki erişim problemi.

Odak kelime doğal geçsin: kripto varlık hukuku
Yardımcı kelimeleri doğal dağıt.

Gövdede "Sık sorulan sorular" bölümü AÇMA (FAQ ayrı).
En sonda ayrı paragraf olarak şu feragat (aynen):
"${DISCLAIMER}"

Yalnızca Markdown gövde döndür.
`.trim();

  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.65 }
  });
  const text = stripFence(res.text || "");
  if (!text) throw new Error("Gemini boş gövde döndürdü.");
  return text;
}

async function generateFaqAnswers(bodyPreview) {
  const prompt = `
Sen hukukportali.com için Türkçe FAQ cevapları yazıyorsun.
Konu: kripto varlık hukuku, kayıp bitcoin, dijital miras.
Ton: Bilgilendirici, kısa-orta uzunlukta, kesin tavsiye yok.
Her cevap 2-4 cümle.

Sorular:
1. Özel anahtarı kaybolan Bitcoin geri alınabilir mi?
2. Kripto paralar mirasa konu olur mu?
3. Mirasçılar ölen kişinin kripto varlıklarına ulaşabilir mi?
4. Soğuk cüzdan şifresi unutulursa ne olur?
5. Kripto varlıklar için dijital miras planlaması yapılmalı mı?

Makale özeti (bağlam):
${bodyPreview.slice(0, 3000)}

Yalnızca geçerli JSON döndür:
{"faq":[{"question":"...","answer":"..."}, ...5 adet]}
`.trim();

  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.5, responseMimeType: "application/json" }
  });
  const parsed = JSON.parse(stripFence(res.text || "{}"));
  if (!Array.isArray(parsed.faq) || parsed.faq.length < 5) {
    throw new Error("FAQ üretilemedi.");
  }
  return parsed.faq.slice(0, 5);
}

function buildMarkdown(article) {
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
  return lines.join("\n");
}

async function main() {
  console.log("Gövde üretiliyor...");
  const content = await generateBody();
  const words = countWords(content);
  console.log(`Gövde: ${words} kelime`);

  console.log("FAQ cevapları üretiliyor...");
  const faq = await generateFaqAnswers(content);

  const today = new Date().toISOString().slice(0, 10);
  const article = {
    ...META,
    faq,
    type: "haber",
    featured: false,
    publishedAt: today,
    updatedAt: today,
    content,
    category: "Haberler",
    tags: META.focusKeywords.slice(0, 8),
    featuredImageSuggestion: "Hard disk, USB bellek ve dijital kilit temalı, kripto güvenliği çağrıştıran modern kapak görseli",
    socialShareText: META.metaDescription,
    conclusion:
      "Dijital servetin en zayıf halkası çoğu zaman insan hatasıdır; hukuki çerçeve erişim bilgisini korumayı ve miras planlamasını önemli kılar.",
    alternativeTitles: [
      "Kayıp Bitcoin ve Kripto Varlık Hukuku",
      "Özel Anahtar Kaybı: Hukuki Sonuçlar",
      "Dijital Miras ve Kripto Paralar"
    ],
    internalLinks: [],
    externalSourceSuggestions: [
      "Kamuoyuna yansıyan James Howells haberleri",
      "Stefan Thomas IronKey haberleri",
      "Türkiye kripto varlık mevzuatı özeti"
    ]
  };

  writeFileSync(OUTPUT_JSON, `${JSON.stringify(article, null, 2)}\n`, "utf8");
  writeFileSync(OUTPUT_MD, buildMarkdown(article), "utf8");
  console.log(`Kaydedildi: generated-articles/${SLUG}.json`);
  console.log(`URL: /haber/${SLUG}`);
}

main().catch((err) => {
  console.error("HATA:", err.message || err);
  process.exit(1);
});
