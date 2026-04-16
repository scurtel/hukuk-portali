#!/usr/bin/env python3
"""
RSS tabanlı hukuk haber toplayıcı.

.env içindeki RSS_FEEDS değişkeninde virgülle ayrılmış TÜM RSS URL'leri sırayla tarar;
her kaynak için feedparser ile girişler toplanır.

Kullanım:
  python automation/crawler.py
  python automation/crawler.py --output automation/data/rss_items.json

Çevre değişkeni RSS_FEEDS: virgülle ayrılmış tam RSS URL listesi.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import feedparser

from db_utils import repo_root
from env_loader import load_all_env

# Gemini bağlamı için üst sınır (başlık + özet birlikte)
MAX_SUMMARY_CHARS = 12000

HEADERS = {"User-Agent": "HukukportaliRSSBot/1.0 (+https://hukukportali.com)"}


def strip_html(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_lib.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_best_summary(e: feedparser.FeedParserDict) -> str:
    """
    RSS/Atom kaynaklarında özet metni mümkün olduğunca zengin toplar:
    summary_detail, summary, description, content dizisi, media:description vb.
    """
    parts: list[str] = []

    sd = e.get("summary_detail")
    if sd:
        if isinstance(sd, dict):
            v = sd.get("value")
        else:
            v = getattr(sd, "value", None)
        if v:
            parts.append(strip_html(str(v)))

    raw_summary = e.get("summary")
    if raw_summary and str(raw_summary).strip():
        parts.append(strip_html(str(raw_summary)))

    desc = e.get("description")
    if desc and str(desc).strip():
        parts.append(strip_html(str(desc)))

    # Atom: content veya content:encoded benzeri
    content = e.get("content")
    if content and isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("value"):
                parts.append(strip_html(str(block["value"])))

    # Bazı beslemelerde uzun metin 'content' altında tek string olabilir
    if not parts:
        for key in ("content", "subtitle"):
            val = e.get(key)
            if isinstance(val, str) and val.strip():
                parts.append(strip_html(val))

    # Yinelenen paragrafları kısalt: en uzun benzersiz parçaları birleştir
    seen: set[str] = set()
    merged: list[str] = []
    for p in parts:
        p = p.strip()
        if len(p) < 20:
            continue
        key = p[:200]
        if key in seen:
            continue
        seen.add(key)
        merged.append(p)

    text = "\n\n".join(merged) if merged else ""
    if not text:
        return ""
    return text[:MAX_SUMMARY_CHARS]


def load_feed_urls() -> list[str]:
    raw = os.environ.get("RSS_FEEDS", "").strip()
    if not raw:
        return []
    return [u.strip() for u in raw.split(",") if u.strip()]


def normalize_entry(e: feedparser.FeedParserDict) -> dict[str, Any]:
    title = (e.get("title") or "").strip()
    link = (e.get("link") or "").strip()
    summary = extract_best_summary(e)
    published = e.get("published") or e.get("updated") or ""
    return {
        "title": title,
        "link": link,
        "summary": summary,
        "published": published,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
    }


def fetch_all_items(feed_urls: list[str]) -> list[dict]:
    items: list[dict] = []
    total_feeds = len(feed_urls)

    for idx, url in enumerate(feed_urls, start=1):
        print(f"[{idx}/{total_feeds}] RSS okunuyor: {url}")
        parsed = feedparser.parse(url, request_headers=HEADERS)
        if parsed.bozo and parsed.bozo_exception:
            print(f"  [uyarı] Ayrıştırma: {parsed.bozo_exception}")
        count = 0
        for e in parsed.entries:
            row = normalize_entry(e)
            if row["title"] and row["link"]:
                items.append({"feed": url, **row})
                count += 1
        print(f"  -> {count} giriş")

    # Aynı link birden fazla kaynakta dönerse ilk kaydı tut, özeti uzun olanı tercih et
    by_link: dict[str, dict] = {}
    for it in items:
        lk = it["link"]
        if lk not in by_link:
            by_link[lk] = it
        else:
            prev = by_link[lk]
            if len(it.get("summary") or "") > len(prev.get("summary") or ""):
                by_link[lk] = it

    merged = list(by_link.values())
    merged.sort(key=lambda x: x.get("published") or "", reverse=True)
    return merged


def default_output_path() -> Path:
    return repo_root() / "automation" / "data" / "rss_items.json"


def run_crawl(output: Path | None = None) -> Path:
    load_all_env()
    output = output or default_output_path()
    output.parent.mkdir(parents=True, exist_ok=True)

    feeds = load_feed_urls()
    if not feeds:
        raise SystemExit(
            "RSS_FEEDS tanımlı değil. Kök .env veya automation/.env içine virgülle ayrılmış RSS URL'leri ekleyin.\n"
            "Örnek: RSS_FEEDS=https://ornek.com/feed,https://baska.com/rss"
        )

    items = fetch_all_items(feeds)
    output.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Toplam {len(items)} benzersiz kayıt yazıldı: {output}")
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description="RSS crawler (hukuk haber kaynakları)")
    parser.add_argument(
        "--output",
        type=str,
        default="",
        help="JSON çıktı yolu (varsayılan: automation/data/rss_items.json)",
    )
    args = parser.parse_args()

    out = Path(args.output) if args.output else default_output_path()
    if not out.is_absolute():
        out = repo_root() / out
    run_crawl(out)


if __name__ == "__main__":
    main()
