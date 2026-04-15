import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

const POSTS = [
  {
    slug: "anayasa-mahkemesi-yeni-karar",
    title: "Anayasa Mahkemesi'nden Bireysel Başvuruya İlişkin Yeni Karar",
    type: "haber",
    excerpt: "Mahkemenin son kararı, ifade özgürlüğü başvurularında yeni bir yaklaşım sunuyor."
  },
  {
    slug: "is-kanunu-degisiklik-taslagi",
    title: "İş Kanunu Değişiklik Taslağı Kamuoyuna Sunuldu",
    type: "haber",
    excerpt: "Taslak metin, fazla mesai ve uzaktan çalışma maddelerinde önemli yenilikler içeriyor."
  },
  {
    slug: "kvkk-ceza-uygulamalari-2026",
    title: "KVKK Ceza Uygulamalarında 2026 İlk Çeyrek Verileri",
    type: "haber",
    excerpt: "Kurul kararlarında veri güvenliği ihlalleri öne çıkıyor."
  },
  {
    slug: "iscilik-alacagi-davasi-nasil-acilir",
    title: "İşçilik Alacağı Davası Nasıl Açılır? Adım Adım Rehber",
    type: "rehber",
    excerpt: "Dava öncesi arabuluculuk, dilekçe hazırlığı ve delil listesi sürecini özetliyoruz."
  },
  {
    slug: "tutuklamaya-itiraz-sureci",
    title: "Tutuklamaya İtiraz Süreci: Haklar ve Süreler",
    type: "rehber",
    excerpt: "Ceza yargılamasında itiraz mekanizması ve pratik uygulama notları."
  },
  {
    slug: "kvkk-ihlali-bildirimi-rehberi",
    title: "KVKK İhlal Bildirimi Rehberi",
    type: "rehber",
    excerpt: "İhlal tespiti sonrası yapılacak bildirimin kapsamı ve teknik hazırlık listesi."
  },
  {
    slug: "ifade-ozgurlugu-karar-analizi",
    title: "İfade Özgürlüğü Karar Analizi: Ölçülülük Testi",
    type: "analiz",
    excerpt: "Yeni kararda uygulanan ölçülülük testi önceki içtihatla karşılaştırılıyor."
  },
  {
    slug: "uzaktan-calisma-sozlesmeleri-analizi",
    title: "Uzaktan Çalışma Sözleşmelerinde Güncel Riskler",
    type: "analiz",
    excerpt: "Taslak düzenleme ışığında işveren ve çalışan açısından kritik noktalar."
  },
  {
    slug: "acik-riza-metni-yeterlilik-analizi",
    title: "Açık Rıza Metinlerinde Yeterlilik Sorunu",
    type: "analiz",
    excerpt: "Kurul kararları kapsamında açık rızanın geçerlilik kriterleri ele alınıyor."
  }
];

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY tanımlı değil.");
}

const ai = new GoogleGenAI({ apiKey });

const basePrompt = `
Sen hukukportali.com için yazan kıdemli bir hukuk editörüsün.
Türkçe, profesyonel ve anlaşılır bir metin yaz.
Metin 500-900 kelime arasında olsun.
H2 ve H3 başlıkları kullan.
Mümkünse güncel mevzuata ve içtihatlara değin.
Yazının sonunda "Yazan: Avukat Ceren Sümer Cilli" satırı bulunsun.
`.trim();

function buildPrompt(post) {
  return `
${basePrompt}

İçerik türü: ${post.type}
Başlık: ${post.title}
Özet: ${post.excerpt}

Tek bir bütün metin üret.
  `.trim();
}

async function generateAll() {
  const result = {};

  for (const post of POSTS) {
    console.log(`Üretiliyor: ${post.slug}`);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(post),
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error(`İçerik üretilemedi: ${post.slug}`);
    }

    result[post.slug] = text;
  }

  const output = `export const generatedPostContents: Record<string, string> = ${JSON.stringify(result, null, 2)};\n`;
  const outputPath = resolve("lib/generatedPostContents.ts");
  writeFileSync(outputPath, output, "utf8");
  console.log(`Tamamlandı: ${outputPath}`);
}

generateAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
