#!/usr/bin/env python3
"""
Gemini (JSON mode) ile günlük içerik üretimi ve PostgreSQL (Supabase) veritabanına yazma.

Varsayılan günlük kota:
  - 2 haber (haber)
  - 1 analiz (analiz)
  - 1 rehber (rehber)

Kullanım:
  python automation/content_manager.py --daily
  python automation/content_manager.py --daily --skip-crawl   # mevcut rss_items.json ile
"""

from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any

import google.generativeai as genai

from crawler import default_output_path, run_crawl
from dalle_cover import generate_cover_image_file
from db_utils import connect, insert_post as db_insert_post, repo_root
from env_loader import load_all_env


DISCLAIMER_TR = (
    "\n\n---\n\n"
    "*Bu metin yapay zekâ araçlarıyla oluşturulmuş özet ve bilgilendirme niteliğindedir; "
    "resmî mevzuat, içtihat ve somut dosya bağlamı yerine geçmez. Hukuki sonuç için bir avukata danışınız.*"
)

# Tüm Gemini promptlarına eklenecek editoryal çerçeve (hukuk portalı odaklı içerik)
EDITORIAL_SCOPE_TR = """
Sen bir hukuk editörüsün. Sana gelen listedeki haberleri "hukuki değer" süzgecinden geçir:
Öncelikle hukuk, mevzuat, yargı kararları, ekonomi ve vatandaşın yasal haklarıyla doğrudan ilişkili içerikleri seç.
Alakasız (saf magazin, spor, yemek, oyun, dedikodu vb.) haberleri üretime alma.
Ayrıca: Yalnızca popüler bir magazin figürünün kişisel adli süreci olup toplumsal veya hukuki emsal / genişletilebilir ilkeler teşkil etmeyen içerikleri de üretime alma; bunları skipped say veya analizde kullanma.
"""

USED_PATH = repo_root() / "automation" / "data" / "used_sources.json"


def parse_json_text(text: str) -> dict[str, Any]:
    text = (text or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text).strip()
    return json.loads(text)


def gemini_json(model: str, prompt: str) -> dict[str, Any]:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY tanımlı değil (.env dosyasına ekleyin).")

    genai.configure(api_key=api_key)
    generation_config = genai.GenerationConfig(
        response_mime_type="application/json",
        temperature=0.35,
    )
    m = genai.GenerativeModel(model_name=model, generation_config=generation_config)
    response = m.generate_content(prompt)
    raw = (response.text or "").strip()
    if not raw:
        raise RuntimeError("Gemini boş yanıt döndürdü.")
    return parse_json_text(raw)


def load_used_links() -> set[str]:
    if not USED_PATH.exists():
        return set()
    data = json.loads(USED_PATH.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return set(str(x) for x in data)
    if isinstance(data, dict) and "links" in data:
        return set(str(x) for x in data["links"])
    return set()


def save_used_links(links: set[str]) -> None:
    USED_PATH.parent.mkdir(parents=True, exist_ok=True)
    USED_PATH.write_text(json.dumps(sorted(links), ensure_ascii=False, indent=2), encoding="utf-8")


def image_prefix() -> str:
    url = os.environ.get("IMAGE_PLACEHOLDER_URL", "").strip()
    if not url:
        return ""
    return f"![Görsel]({url})\n\n"


def compose_article_markdown(body: str, cover_url: str | None) -> str:
    """DALL-E kapak varsa üstte; yoksa isteğe bağlı IMAGE_PLACEHOLDER_URL."""
    if cover_url:
        return f"![Kapak]({cover_url})\n\n" + body + DISCLAIMER_TR
    return image_prefix() + body + DISCLAIMER_TR


def normalize_article_payload(data: dict[str, Any]) -> tuple[str, str, str, str | None] | None:
    """Alakasız içerik için model {\"skipped\": true} döndürebilir."""
    if data.get("skipped") is True or str(data.get("skipped", "")).lower() == "true":
        return None
    title = str(data.get("title") or "").strip()
    excerpt = str(data.get("excerpt") or data.get("summary") or "").strip()
    body = str(data.get("content") or data.get("body") or data.get("content_markdown") or "").strip()
    slug_hint = str(data.get("slug") or "").strip() or None
    if not title or not excerpt or not body:
        raise ValueError("JSON içinde title / excerpt / content alanları eksik.")
    excerpt = excerpt[:500]
    return title, excerpt, body, slug_hint


def _log_insert(post_type: str, title: str, slug: str, image_url: str | None) -> None:
    public_path = f"/analizler/{slug}" if post_type == "analiz" else f"/{post_type}/{slug}"
    img = f" | kapak: {image_url}" if image_url else ""
    print(f"[ok] {post_type}: {title} -> {public_path}{img}")


def prompt_haber(item: dict[str, Any]) -> str:
    summary = (item.get("summary") or "").strip()
    return f"""Sen Türkiye hukuku bağlamında profesyonel haber editörüsün.
{EDITORIAL_SCOPE_TR}

Aşağıdaki kaynak haberi BAĞIMSIZ biçimde yeniden yaz; kaynak metni kopyalama, özetle ve hukuki terminoloji kullan.
Kaynak URL'sini metnin içinde verme; sadece genel bilgilendirme sun. Özet alanı uzunsa, ana hukuki mesajları çıkar.

Kaynak başlık: {item.get("title","")}
Kaynak özet (RSS/HTML temizlenmiş): {summary}

Kurallar:
- Türkçe, saygılı ve net bir hukuk dili.
- Konu yukarıdaki editoryal çerçeveye UYMUYORSA (magazin, spor vb.), makale üretme; yalnızca şu JSON'u döndür: {{"skipped": true, "reason": "kısa gerekçe"}}
- Konu uygunsa makale üret: yanıt YALNIZCA geçerli bir JSON nesnesi olsun (ekstra markdown kod çiti yok).
- Makale JSON alanları: "title", "excerpt" (en fazla 220 karakter), "content" (Markdown, H2/H3 başlıklar kullan), "slug" (küçük harf, latin harfleri ve tire; Türkçe karakter kullanma).

İçeriğin sonuna şu cümleyi Markdown olarak ekleme; sistem ayrıca ekleyecek.
"""


def prompt_analiz(lines: list[str]) -> str:
    joined = "\n".join(f"- {h}" for h in lines)
    return f"""Sen Türk hukuku alanında analiz yazarısın.
{EDITORIAL_SCOPE_TR}

Aşağıdaki satırlarda her biri "Başlık — Özet: ..." biçiminde olabilir. Önce yalnızca hukuk/mevzuat/yargı/ekonomi/yasal haklarla ilgili satırları zihninde seç; alakasız olanları analize dahil etme.
Seçtiklerinden yola çıkarak TEK bir ANALİZ metni üret: sorunun hukuki çerçevesi, ilgili genel ilkeler ve pratikte dikkat edilecek noktalar.
Eğer listede hiç uygun konu kalmazsa, genel çerçevede "güncel hukuk gündemine genel bakış" niteliğinde nötr bir analiz yaz (spekülasyondan kaçın).

Girdi satırları:
{joined}

Kurallar:
- Türkçe, akademik ama anlaşılır dil.
- Kesin hüküm verme; "genel çerçeve" ve "avukata danışın" vurgusu yap.
- Yanıt YALNIZCA geçerli JSON: "title", "excerpt" (<=220 karakter), "content" (Markdown), "slug" (latin, tire).
"""


def prompt_rehber(topic: str) -> str:
    return f"""Sen Türk hukuku için uygulama rehberi yazarısın.
{EDITORIAL_SCOPE_TR}

Konu veya çıkış noktası: {topic}

Üret:
- Konu hukuk/mevzuat/yasal haklar ile ilgili olmalı; değilse yine de genel ve güvenli bir hukuki rehber konusu seç (ör. sözleşme, başvuru yolları) ve magazin/spor içerme.
- Okuyucunun adım adım izleyebileceği bir rehber (Markdown, H2/H3).
- Yasal süre ve merci isimlerini genel düzeyde doğru kullan; belirsizlikte avukata yönlendir.

Yanıt YALNIZCA JSON: "title", "excerpt" (<=220 karakter), "content", "slug" (latin, tire).
"""


def format_headline_with_summary(item: dict[str, Any]) -> str:
    title = str(item.get("title") or "").strip()
    summary = (item.get("summary") or "").strip()
    if summary:
        sm = summary.replace("\n", " ")[:900]
        return f"{title} — Özet: {sm}"
    return title


def load_rss_items(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data.get("items") or []
    if not isinstance(items, list):
        raise ValueError("rss_items.json beklenen formatta değil (items dizisi).")
    return items


def run_daily(*, skip_crawl: bool) -> None:
    load_all_env()
    model = os.environ.get("GEMINI_MODEL", "gemini-3-flash").strip()

    rss_path = default_output_path()
    if not skip_crawl:
        run_crawl(rss_path)
    if not rss_path.exists():
        raise SystemExit(f"RSS veri dosyası yok: {rss_path}. Önce crawler çalıştırın.")

    items = load_rss_items(rss_path)
    used = load_used_links()
    fresh = [i for i in items if str(i.get("link") or "").strip() and str(i.get("link")).strip() not in used]

    conn = connect()
    try:
        new_links: set[str] = set(used)

        # 2 haber: alakasız içerik atlanınca sonraki RSS maddesine geç
        news_items: list[dict[str, Any]] = []
        fi = 0
        max_attempts = min(len(fresh), 40)
        while len(news_items) < 2 and fi < max_attempts:
            it = fresh[fi]
            fi += 1
            link = str(it.get("link") or "").strip()
            payload = gemini_json(model, prompt_haber(it))
            parsed = normalize_article_payload(payload)
            if parsed is None:
                reason = str(payload.get("reason") or "").strip()
                print(f"[atlandı] Haber (alakasız veya skipped): {link[:80]}... {reason}")
                continue
            title, excerpt, body, slug_hint = parsed
            cover = generate_cover_image_file(title)
            content = compose_article_markdown(body, cover)
            slug_h, _ = db_insert_post(
                conn,
                post_type="haber",
                title=title,
                excerpt=excerpt,
                content=content,
                slug_base=slug_hint or title,
                image_url=cover,
            )
            _log_insert("haber", title, slug_h, cover)
            if link:
                new_links.add(link)
            news_items.append(it)

        if len(news_items) < 2:
            print(
                f"[uyarı] Bugün için 2 haber tamamlanamadı (üretilen: {len(news_items)}). "
                "Daha fazla RSS kaynağı veya yeni madde gerekli olabilir."
            )

        headline_lines = [format_headline_with_summary(i) for i in fresh[:12]]
        if not headline_lines:
            headline_lines = ["Güncel hukuk gündemi ve yargı içtihatlarına genel bakış"]

        payload_a = gemini_json(model, prompt_analiz(headline_lines[:10]))
        parsed_a = normalize_article_payload(payload_a)
        if parsed_a is None:
            raise RuntimeError("Analiz çıktısı skipped/boş döndü; prompt veya model yanıtını kontrol edin.")
        title_a, excerpt_a, body_a, slug_a = parsed_a
        cover_a = generate_cover_image_file(title_a)
        content_a = compose_article_markdown(body_a, cover_a)
        slug_a_final, _ = db_insert_post(
            conn,
            post_type="analiz",
            title=title_a,
            excerpt=excerpt_a,
            content=content_a,
            slug_base=slug_a or title_a,
            image_url=cover_a,
        )
        _log_insert("analiz", title_a, slug_a_final, cover_a)

        if news_items:
            first = news_items[0]
            topic = f"{first.get('title', '')}\nÖzet: {(first.get('summary') or '')[:1200]}"
        else:
            topic = headline_lines[0] if headline_lines else "Güncel hukuk uyuşmazlıkları"
        payload_r = gemini_json(model, prompt_rehber(topic))
        parsed_r = normalize_article_payload(payload_r)
        if parsed_r is None:
            raise RuntimeError("Rehber çıktısı skipped/boş döndü; prompt veya model yanıtını kontrol edin.")
        title_r, excerpt_r, body_r, slug_r = parsed_r
        cover_r = generate_cover_image_file(title_r)
        content_r = compose_article_markdown(body_r, cover_r)
        slug_r_final, _ = db_insert_post(
            conn,
            post_type="rehber",
            title=title_r,
            excerpt=excerpt_r,
            content=content_r,
            slug_base=slug_r or title_r,
            image_url=cover_r,
        )
        _log_insert("rehber", title_r, slug_r_final, cover_r)

        conn.commit()
        save_used_links(new_links)
        print("Günlük içerik üretimi tamamlandı.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Gemini ile içerik üretimi ve DB yazımı")
    parser.add_argument("--daily", action="store_true", help="Günlük kota ile üret")
    parser.add_argument("--skip-crawl", action="store_true", help="RSS yeniden indirme; mevcut JSON kullan")
    args = parser.parse_args()

    if not args.daily:
        parser.error("Şimdilik yalnızca --daily destekleniyor.")

    run_daily(skip_crawl=args.skip_crawl)


if __name__ == "__main__":
    main()
