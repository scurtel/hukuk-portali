# Hukuk Portalı — otomatik içerik hattı (RSS + Gemini + SQLite)

Bu klasör, **Prisma şemanızdaki `Post` tablosuna** kayıt atan Python betiklerini içerir. **PostgreSQL (Supabase)** üzerindeki `DATABASE_URL` ile çalışır (`psycopg`). Next.js tarafı içerikleri **`lib/posts.ts` → Prisma** ile okur.

## 1) Veritabanı tabloları ve yazım hedefi

`prisma/schema.prisma` özeti:

| Tablo | Amaç |
|--------|------|
| **Author** | Yazar (`slug`, `name`, `title`, `bio`, `avatar?`). Seed: `av-ceren-sumer-cilli`. |
| **Category** | Kategori (`slug`, `name`, `description`, `type`). Seed: `haber`, `rehber`, `analiz`. |
| **Post** | İçerik: `slug` (benzersiz), `title`, `excerpt`, `content` (Markdown), `type`, isteğe bağlı **`imageUrl`** (kapak yolu, örn. `/images/covers/cover-....png`), `publishedAt`, `featured`, `authorId`, `categoryId`. |

`content_manager.py` her yeni içerik için bir satır **INSERT** eder; `slug` çakışırsa otomatik `-2`, `-3` … ile uzatılır.

## 2) Sizden gerekenler (API anahtarı ve ortam)

1. **Google AI Studio** üzerinden bir **Gemini API Key** oluşturun: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. **OpenAI** üzerinden **DALL-E 3** için API anahtarı: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) — `OPENAI_API_KEY` (kapak görselleri `public/images/covers/` altına yazılır ve `Post.imageUrl` alanına işlenir). Anahtar yoksa kapak atlanır, isteğe bağlı `IMAGE_PLACEHOLDER_URL` kullanılır.
3. Proje kökünde `.env` dosyanıza ekleyin (veya `automation/.env`):

   ```env
   GEMINI_API_KEY=...
   OPENAI_API_KEY=...
   GEMINI_MODEL=gemini-3-flash
   DATABASE_URL=postgresql://...   # Supabase URI (Python ile aynı)
   RSS_FEEDS=https://ornek.com/feed,https://baska.com/rss
   IMAGE_PLACEHOLDER_URL=https://...   # DALL-E yoksa isteğe bağlı yedek
   ```

4. **Model adı:** Hesabınızda hangi model açıksa onu yazın. Bu repoda Next tarafı `gemini-3-flash` kullanıyor; Google tarafında isim değişebilir. Hata alırsanız AI Studio’da listelenen Flash model adını deneyin (ör. `gemini-2.0-flash`).

5. **RSS listesi:** `RSS_FEEDS` içine hukuk/haber kaynaklarınızın **RSS** adreslerini virgülle ekleyin. Kaynakların kullanım şartlarına ve robots kurallarına uyun.

## 3) Kurulum (bir kez)

```bash
cd hukukportali
npm install
npx prisma migrate deploy
npm run prisma:seed
python -m pip install -r automation/requirements.txt
```

Geliştirme ortamında ilk kez: `npx prisma migrate dev` kullanabilirsiniz.

## 4) Manuel çalıştırma

```bash
# RSS indir
npm run content:crawl

# Günlük kota: 2 haber + 1 analiz + 1 rehber (Gemini JSON mode)
npm run content:daily
```

RSS’i tekrar indirmeden son `rss_items.json` ile:

```bash
python automation/content_manager.py --daily --skip-crawl
```

## 5) Zamanlama (otomatik tetikleme)

### Linux / sunucu (cron)

`crontab -e` örneği (her gün 07:15):

```cron
15 7 * * * cd /path/to/hukukportali && ./automation/run_daily.sh >> /var/log/hukukportali-content.log 2>&1
```

### Windows (Görev Zamanlayıcısı)

1. `automation/run_daily.ps1` içindeki `Set-Location` yolunu kendi proje dizininizle değiştirin.
2. Görev Zamanlayıcısı → **Temel görev oluştur** → Günlük → Program: `powershell.exe`  
   Bağımsız değişkenler: `-ExecutionPolicy Bypass -File "C:\...\hukukportali\automation\run_daily.ps1"`

### GitHub Actions (isteğe bağlı)

Repo gizli değişkeni olarak `GEMINI_API_KEY` tanımlayıp günlük `cron` workflow çalıştırabilirsiniz; SQLite dosyasını kalıcı tutmak için artifact veya harici DB gerekir.

## 6) Kapak görseli (DALL-E 3)

`OPENAI_API_KEY` tanımlıysa her yazı için **DALL-E 3** ile minimalist, kurumsal hukuk temalı kapak üretilir; dosya `public/images/covers/cover-<id>.png` olarak kaydedilir ve **`Post.imageUrl`** alanına (ör. `/images/covers/cover-....png`) yazılır. Markdown gövdesinin başına da aynı görsel `![Kapak](...)` ile eklenir.

`OPENAI_API_KEY` yoksa veya API hata verirse: isteğe bağlı `IMAGE_PLACEHOLDER_URL` kullanılır; o da yoksa üstte ek görsel satırı eklenmez.

## 7) JSON mode ve hukuki dil

`google.generativeai` ile `response_mime_type="application/json"` kullanılıyor; ardından `json.loads` ile doğrulanıyor. Promptlar Türkçe hukuk diline yönlendirilir; metin sonuna otomatik **yapay zekâ uyarısı** eklenir.

## 8) Dosya özeti

| Dosya | Görev |
|--------|--------|
| `crawler.py` | RSS’ten madde toplar → `automation/data/rss_items.json` |
| `content_manager.py` | Gemini ile üretir → `Post` tablosuna yazar, kullanılan haber URL’lerini `used_sources.json` içinde tutar |
| `dalle_cover.py` | DALL-E 3 kapak → `public/images/covers/`, `Post.imageUrl` |
| `db_utils.py` | SQLite yolu, slug, yazar/kategori id |
| `env_loader.py` | `.env` yükleyici |
| `requirements.txt` | Python bağımlılıkları |
| `run_daily.sh` / `run_daily.ps1` | Günlük çalıştırma şablonları |
