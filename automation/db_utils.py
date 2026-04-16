"""
PostgreSQL (Supabase) bağlantısı — DATABASE_URL ile.
Örnek: postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
"""

from __future__ import annotations

import os
import re
import unicodedata
import uuid
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent

try:
    import psycopg
    from psycopg import Connection
except ImportError as e:
    raise ImportError("psycopg gerekli: pip install 'psycopg[binary]'") from e


def _normalize_database_url(url: str) -> str:
    """Supabase URI'de sslmode yoksa ekler; şifredeki özel karakterler URI olarak kodlanmış olmalıdır."""
    url = url.strip()
    if not url:
        return url
    if "sslmode=" not in url and "supabase.co" in url:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}sslmode=require"
    return url


def connect() -> Connection:
    url = _normalize_database_url(os.environ.get("DATABASE_URL", ""))
    if not url:
        raise RuntimeError(
            "DATABASE_URL tanımlı değil. Supabase Project Settings → Database → Connection string (URI) değerini .env içine yapıştırın."
        )
    return psycopg.connect(url, autocommit=False)


def slugify(text: str, max_len: int = 72) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    text = re.sub(r"-{2,}", "-", text)
    return (text or "icerik")[:max_len]


def get_author_id(conn: Connection, slug: str = "av-ceren-sumer-cilli") -> str:
    with conn.cursor() as cur:
        cur.execute('SELECT id FROM "Author" WHERE slug = %s', (slug,))
        row = cur.fetchone()
    if not row:
        raise RuntimeError(f'Author bulunamadı (slug={slug}). Çalıştırın: npm run prisma:seed')
    return str(row[0])


def get_category_id(conn: Connection, slug: str) -> str:
    with conn.cursor() as cur:
        cur.execute('SELECT id FROM "Category" WHERE slug = %s', (slug,))
        row = cur.fetchone()
    if not row:
        raise RuntimeError(f'Kategori bulunamadı (slug={slug}). Çalıştırın: npm run prisma:seed')
    return str(row[0])


def slug_exists(conn: Connection, slug: str) -> bool:
    with conn.cursor() as cur:
        cur.execute('SELECT 1 FROM "Post" WHERE slug = %s LIMIT 1', (slug,))
        return cur.fetchone() is not None


def unique_slug(conn: Connection, base: str) -> str:
    candidate = base
    n = 2
    while slug_exists(conn, candidate):
        suffix = f"-{n}"
        candidate = (base[: 80 - len(suffix)] + suffix) if len(base) + len(suffix) > 80 else base + suffix
        n += 1
    return candidate


def insert_post(
    conn: Connection,
    *,
    post_type: str,
    title: str,
    excerpt: str,
    content: str,
    slug_base: str,
    image_url: str | None = None,
) -> tuple[str, str]:
    """(slug, post_id) döner."""
    author_id = get_author_id(conn)
    category_id = get_category_id(conn, post_type)
    slug = unique_slug(conn, slugify(slug_base))
    post_id = str(uuid.uuid4())
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO "Post" ("id", "slug", "title", "excerpt", "content", "type", "imageUrl", "publishedAt", "featured", "authorId", "categoryId", "createdAt", "updatedAt")
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s, NOW(), NOW())
            """,
            (
                post_id,
                slug,
                title,
                excerpt,
                content,
                post_type,
                image_url,
                False,
                author_id,
                category_id,
            ),
        )
    return slug, post_id
