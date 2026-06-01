/**
 * generatedLegalArticleData.ts — yalnızca meta/SSS alanlarını nötrleştirir; gövde (contents) dokunulmaz.
 * Çalıştırma: node scripts/neutralize-legal-article-meta.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve("lib/generatedLegalArticleData.ts");
const CONTENTS_MARKER = "export const generatedLegalArticleContents";

const raw = readFileSync(FILE, "utf8");
const markerIndex = raw.indexOf(CONTENTS_MARKER);
if (markerIndex < 0) {
  throw new Error("generatedLegalArticleContents bulunamadı");
}

let metasPart = raw.slice(0, markerIndex);
const contentsPart = raw.slice(markerIndex);

function neutralizeMetas(text) {
  let s = text;

  s = s.replace(/\s*"Avukat Ceren Sümer Cilli",?\r?\n/g, "\n");
  s = s.replace(/\s*"Av\. Ceren Sümer Cilli",?\r?\n/g, "\n");

  s = s.replace(/ \| Adana Boşanma Avukatı Ceren Sümer Cilli/g, "");
  s = s.replace(/Avukat Ceren Sümer Cilli ile stratejik dava yönetimi\./g, "Dava süreci ve delil yönetimi rehberi.");
  s = s.replace(/Avukat Ceren Sümer Cilli'den stratejik destek\./g, "Hukukportali rehberi.");
  s = s.replace(/Avukat Ceren Sümer Cilli'den bilgi alın\./g, "");
  s = s.replace(/Avukat Ceren Sümer Cilli'den hukuki destek alın\./g, "");
  s = s.replace(/Avukat Ceren Sümer Cilli'den bilgiler\./g, "");
  s = s.replace(
    /, Avukat Ceren Sümer Cilli'nin uzmanlık alanlarını ve vatandaşların/g,
    "; vatandaşların"
  );
  s = s.replace(
    /Avukat Ceren Sümer Cilli'nin uzman bakış açısıyla güvenli alım yapın\./g,
    "Güvenli alım için rehber adımlar."
  );
  s = s.replace(/Adana gayrimenkul avukatı rehberliğinde /g, "");
  s = s.replace(/Adana miras avukatı danışmanlığı\./g, "Miras süreçleri rehberi.");
  s = s.replace(/Adana bölgesinde Avukat Ceren Sümer Cilli'den /g, "");

  s = s.replace(/"focusKeyword": "Adana gayrimenkul avukatı"/g, '"focusKeyword": "Adana tapu kaydı inceleme"');
  s = s.replace(/"Adana tapu avukatı"/g, '"Adana tapu işlemleri"');
  s = s.replace(/"Adana boşanma avukatı"/g, '"boşanma hukuku"');
  s = s.replace(/"Adana miras avukatı"/g, '"miras hukuku"');
  s = s.replace(/"Adana ortaklığın giderilmesi avukatı"/g, '"ortaklığın giderilmesi"');
  s = s.replace(/"boşanma avukatı"/g, '"boşanma mal paylaşımı"');

  s = s.replace(
    /"question": "Avukat Ceren Sümer Cilli'nin rolü mal paylaşımında neden önemlidir\?",\s*"answer": "[\s\S]*?"(?=\s*\})/,
    `"question": "Mal paylaşımında profesyonel değerlendirme neden önemlidir?",\n        "answer": "Mal paylaşımında malvarlığının doğru tespiti, kişisel ve edinilmiş malların ayrımı ile katılma alacağının hesaplanması karmaşık olabilir. Somut dosyada uzman değerlendirme hak kaybı riskini azaltabilir; bu metin genel bilgilendirme sunar."`
  );

  s = s.replace(
    `"question": "Adana'da gayrimenkul avukatı seçerken nelere dikkat etmeliyim?"`,
    `"question": "Gayrimenkul alımında hukuki inceleme ne zaman gerekir?"`
  );
  s = s.replace(
    `"answer": "Adana'da gayrimenkul avukatı seçerken, avukatın gayrimenkul hukuku alanındaki uzmanlığı ve deneyimi, iletişim becerileri, sektördeki itibarı ve referansları önemlidir. Bölgedeki hukuki dinamikleri iyi bilen bir avukat, size daha etkin destek sağlayabilir."`,
    `"answer": "Tapu kaydı, şerhler, imar durumu ve sözleşme şartları karmaşıklaştığında veya yüksek tutarlı işlemlerde hukuki inceleme önerilir. Süreç genel bilgilendirme çerçevesinde planlanmalı; somut dosya için uzman değerlendirme gerekebilir."`
  );

  s = s.replace(
    `"question": "Velayet davasında Adana'da bir avukatla çalışmak neden önemlidir?"`,
    `"question": "Velayet davasında profesyonel destek ne sağlar?"`
  );
  s = s.replace(
    `"answer": "Velayet davaları, hukuki bilgi ve tecrübe gerektiren karmaşık süreçlerdir. Adana'da bir avukatla çalışmak, yerel mahkeme pratiklerini ve hukuki prosedürleri iyi bilen bir uzmandan destek almanızı sağlar. Avukat, davanızın doğru bir şekilde yürütülmesine, haklarınızın korunmasına ve çocuğunuzun üstün yararının gözetilmesine yardımcı olur."`,
    `"answer": "Velayet davaları delil, sosyal inceleme ve üstün yarar ilkesi açısından karmaşıktır. Profesyonel destek, dilekçe, delil sunumu ve duruşma hazırlığında sürecin doğru yürütülmesine katkı sağlayabilir; somut dosya koşullarına göre değerlendirme gerekir."`
  );

  return s;
}

const updated = neutralizeMetas(metasPart) + contentsPart;
writeFileSync(FILE, updated, "utf8");
console.log("Meta/SSS alanları nötrleştirildi:", FILE);
