# Hukuk Portalı — ajan notları

## Gemini ile hukuk içeriği (entegre akış)

| Amaç | Komut |
|------|--------|
| Ceren 5’li paketi üret (`generated-articles/`) | `npm run content:gemini:ceren-5` |
| Üret + `lib/generatedLegalArticleData.ts` güncelle | `npm run content:legal:sync` |
| Mevcut JSON üstüne yazarak yeniden üret + yayın | `npm run content:legal:sync:force` |
| Sadece yayın (JSON zaten var) | `npm run content:legal:publish` |

Gerekli ortam: kök `.env` içinde `GEMINI_API_KEY`; isteğe bağlı `GEMINI_MODEL`.

Üretim script’i: `scripts/generate-gemini-ceren-5.mjs`. Yayın script’i: `scripts/publish-generated-articles.mjs`.

Detaylı kurallar: `.cursor/rules/hukukportali-legal-content.mdc` (otomatik uygulanır).

## Diğer üretici

Daha uzun kelime aralığı ve farklı konu listesi: `scripts/generate-gemini-drafts.mjs` — doğrudan `node` ile çalıştırılabilir; yayın için yine `npm run content:legal:publish` kullanılır.
