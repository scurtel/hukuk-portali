import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

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

loadEnvFile();

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const OUTPUT = resolve("generated-articles/turkiyede-avukat-sayilari-2025.json");
const SLUG = "turkiyede-avukat-sayilari-2025";

const REFERENCE_BRIEF = `
Kaynak özet (Türkiye Barolar Birliği istatistikleri — kamuya açık veriler, turkiyehukuk.org derlemesi):
- 2014: barolara kayıtlı 86.981 avukat; 2025 sonu: 206.678 avukat (11 yılda yaklaşık %137 artış).
- En kalabalık barolar (2025): İstanbul 67.463, Ankara 26.206, İzmir 14.300, Antalya 8.038, Bursa 6.544.
- 2025 yıllık artışta öne çıkanlar: İstanbul +1.691, Ankara +823, İstanbul 2 No'lu +387, İzmir +381, Bursa +360.
- Kadın avukat oranı 2014'te %40,5 iken 2025'te %48,4; 12 baroda kadın avukat sayısı erkekten fazla.
- 2025'te Sivas (-8), Çankırı (-4), Iğdır (-4) barolarında kayıtlı avukat sayısı azaldı.
- Son 11 yılda en hızlı büyüyen baro: İstanbul (+34.114); en düşük artış: Tunceli (+31).
`.trim();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY tanımlı değil (.env).");
}

const ai = new GoogleGenAI({ apiKey });

async function generateMeta() {
  const prompt = `
Sen hukukportali.com için Türkçe hukuk haberi meta verisi üretiyorsun.
${REFERENCE_BRIEF}

Konu: 2025 avukat sayıları, mesleğin büyümesi, bölgesel dağılım, kadın avukat trendi, LegalTech ve dijital dönüşüm perspektifi.
Slug: ${SLUG}
Ton: Bağımsız hukuk-LegalTech yayını; merak uyandıran ama clickbait olmayan haber başlığı.
Kişisel avukat/büro tanıtımı, "en iyi avukat", "danışın" yok.
Uydurma mahkeme kararı numarası yazma.

Yalnızca geçerli JSON döndür (markdown yok):
{
  "title": "...",
  "slug": "${SLUG}",
  "metaTitle": "max 60 karakter",
  "metaDescription": "max 155 karakter",
  "excerpt": "2-3 cümle özet",
  "focusKeyword": "...",
  "focusKeywords": ["...", "..."],
  "faq": [{"question":"...","answer":"..."}, ... 4 adet]
}
`.trim();

  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  const text = res.text?.trim() || "";
  const json = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
  return JSON.parse(json);
}

async function generateBody(meta) {
  const prompt = `
Sen hukukportali.com için Türkçe güncel hukuk haberi yazıyorsun.
Başlık: ${meta.title}
Özet: ${meta.excerpt}

${REFERENCE_BRIEF}

Kurallar:
- 550-750 kelime; H2/H3 başlıklar; kısa paragraflar; bir madde işaretli liste.
- Verileri TBB istatistikleri çerçevesinde aktar; rakamları abartma veya uydurma.
- LegalTech, yapay zekâ, dava yoğunluğu, genç avukatlar, bölgesel eşitsizlik gibi "haber analizi" açıları ekle.
- Kaynak olarak "Türkiye Barolar Birliği'nin yayımladığı istatistikler" ve genel kamuoyu bilgisini kullan; sahte link verme.
- Kişisel avukat adı, büro reklamı yok.
- Sonuç paragrafı + şu feragat: "Bu metin genel bilgilendirme amaçlıdır; somut olaylarda uzman değerlendirmesi gerekebilir."
- Yalnızca HTML gövde döndür (h1 bir kez, sonra h2/h3, p, ul/li). Markdown kullanma.
`.trim();

  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  return res.text?.trim() || "";
}

async function main() {
  console.log("Meta üretiliyor...");
  const meta = await generateMeta();
  console.log("Gövde üretiliyor...");
  const content = await generateBody(meta);

  const article = {
    ...meta,
    slug: SLUG,
    type: "haber",
    featured: true,
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
    content,
    featuredImageSuggestion: "Adliye veya terazi temalı profesyonel kapak görseli"
  };

  writeFileSync(OUTPUT, `${JSON.stringify(article, null, 2)}\n`, "utf8");
  console.log(`Kaydedildi: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
