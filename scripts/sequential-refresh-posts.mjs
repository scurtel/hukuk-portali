import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";
const GENERATED_PATH = resolve("lib/generatedPostContents.ts");
const POSTS_PATH = resolve("lib/posts.ts");

const posts = [
  {
    slug: "anayasa-mahkemesi-yeni-karar",
    type: "haber",
    title: "Anayasa Mahkemesi'nden Bireysel Başvuruya İlişkin Yeni Karar",
    excerpt: "Mahkemenin son kararı, ifade özgürlüğü başvurularında yeni bir yaklaşım sunuyor."
  },
  {
    slug: "is-kanunu-degisiklik-taslagi",
    type: "haber",
    title: "İş Kanunu Değişiklik Taslağı Kamuoyuna Sunuldu",
    excerpt: "Taslak metin, fazla mesai ve uzaktan çalışma maddelerinde önemli yenilikler içeriyor."
  },
  {
    slug: "kvkk-ceza-uygulamalari-2026",
    type: "haber",
    title: "KVKK Ceza Uygulamalarında 2026 İlk Çeyrek Verileri",
    excerpt: "Kurul kararlarında veri güvenliği ihlalleri öne çıkıyor."
  },
  {
    slug: "iscilik-alacagi-davasi-nasil-acilir",
    type: "rehber",
    title: "İşçilik Alacağı Davası Nasıl Açılır? Adım Adım Rehber",
    excerpt: "Dava öncesi arabuluculuk, dilekçe hazırlığı ve delil listesi sürecini özetliyoruz."
  },
  {
    slug: "tutuklamaya-itiraz-sureci",
    type: "rehber",
    title: "Tutuklamaya İtiraz Süreci: Haklar ve Süreler",
    excerpt: "Ceza yargılamasında itiraz mekanizması ve pratik uygulama notları."
  },
  {
    slug: "kvkk-ihlali-bildirimi-rehberi",
    type: "rehber",
    title: "KVKK İhlal Bildirimi Rehberi",
    excerpt: "İhlal tespiti sonrası yapılacak bildirimin kapsamı ve teknik hazırlık listesi."
  },
  {
    slug: "ifade-ozgurlugu-karar-analizi",
    type: "analiz",
    title: "İfade Özgürlüğü Karar Analizi: Ölçülülük Testi",
    excerpt: "Yeni kararda uygulanan ölçülülük testi önceki içtihatla karşılaştırılıyor."
  },
  {
    slug: "uzaktan-calisma-sozlesmeleri-analizi",
    type: "analiz",
    title: "Uzaktan Çalışma Sözleşmelerinde Güncel Riskler",
    excerpt: "Taslak düzenleme ışığında işveren ve çalışan açısından kritik noktalar."
  },
  {
    slug: "acik-riza-metni-yeterlilik-analizi",
    type: "analiz",
    title: "Açık Rıza Metinlerinde Yeterlilik Sorunu",
    excerpt: "Kurul kararları kapsamında açık rızanın geçerlilik kriterleri ele alınıyor."
  }
];

function parseCurrentContents() {
  const source = readFileSync(GENERATED_PATH, "utf8");
  const match = source.match(/=\s*(\{[\s\S]*\});?\s*$/);
  if (!match) {
    throw new Error("generatedPostContents.ts içeriği çözümlenemedi.");
  }
  const objectLiteral = match[1];
  // Trusted local source file evaluation for preserving existing entries.
  return new Function(`return (${objectLiteral});`)();
}

function escapeTemplateLiteral(text) {
  return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function writeGeneratedContents(contentMap) {
  const keys = Object.keys(contentMap);
  const lines = ['export const generatedPostContents: Record<string, string> = {'];
  for (const key of keys) {
    const value = escapeTemplateLiteral(contentMap[key]);
    lines.push(`  "${key}": \`${value}\`,`);
  }
  lines.push("};", "");
  writeFileSync(GENERATED_PATH, lines.join("\n"), "utf8");
}

function updateExcerptInPostsFile(slug, excerpt) {
  const escapedExcerpt = excerpt.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const source = readFileSync(POSTS_PATH, "utf8");
  const pattern = new RegExp(`(slug: "${slug}",[\\s\\S]*?excerpt:\\s*)"(.*?)"(,\\n\\s*content:)`);
  const updated = source.replace(pattern, `$1"${escapedExcerpt}"$3`);
  writeFileSync(POSTS_PATH, updated, "utf8");
}

function buildPrompt(post) {
  return `
ROLE:
Sen hukukportali.com için içerik üreten kıdemli hukuk editörüsün.

GOREV:
Baslik ve kategoriye gore, 2026 guncelliginde Turk mevzuatina uygun, profesyonel ve SEO uyumlu bir hukuk makalesi yaz.

KURALLAR:
- Makale en az 1000 kelime olsun.
- H2 ve H3 basliklari icersin.
- Google Search Grounding kullanarak guncel Yargitay kararlarina atif yap.
- Emin olmadigin karar numarasi/veri varsa bunu acikca "dogrulanamadi" diye belirt; uydurma yapma.
- Dili profesyonel ama anlasilir tut.
- Metinde dogal bicimde hukukportali.com atfi olsun.
- Lutfen basliklari olustururken satir basina sadece baslik metnini yazma; basina mutlaka ## (H2 icin) veya ### (H3 icin) ekle. Markdown formati disinda cikti verme.
- Makalenin sonunda su satir olsun: "Yazan: Avukat Ceren Sumer Cilli"

CIKTI FORMATI:
Asagidaki etiket formatina kesinlikle uy:
[EXCERPT]
140-220 karakterlik tek paragraf ozet
[/EXCERPT]
[CONTENT]
Markdown formatinda tam makale
[/CONTENT]

BASLIK: ${post.title}
KATEGORI: ${post.type}
MEVCUT OZET: ${post.excerpt}
  `.trim();
}

function parseStructuredResponse(text) {
  const trimmed = text.trim();
  const excerptMatch = trimmed.match(/\[EXCERPT\]\s*([\s\S]*?)\s*\[\/EXCERPT\]/i);
  const contentMatch = trimmed.match(/\[CONTENT\]\s*([\s\S]*?)\s*\[\/CONTENT\]/i);

  if (!excerptMatch || !contentMatch) {
    throw new Error("Yanit beklenen etiket formatinda degil.");
  }

  return {
    excerpt: excerptMatch[1].trim(),
    content: contentMatch[1].trim()
  };
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const contentMap = parseCurrentContents();

  for (const post of posts) {
    console.log(`Isleniyor -> ${post.slug}`);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(post),
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error(`Bos yanit alindi: ${post.slug}`);
    }

    const parsed = parseStructuredResponse(text);
    if (!parsed?.excerpt || !parsed?.content) {
      throw new Error(`JSON formati gecersiz: ${post.slug}`);
    }

    contentMap[post.slug] = parsed.content.trim();
    writeGeneratedContents(contentMap);
    updateExcerptInPostsFile(post.slug, parsed.excerpt.trim());

    console.log(`Guncellendi -> ${post.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
