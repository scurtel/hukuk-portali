"""
DALL-E 3 ile hukuk temalı minimalist kapak görseli üretir, public/images/covers/ altına kaydeder.
OPENAI_API_KEY gerekir.
"""

from __future__ import annotations

import base64
import os
import uuid

from db_utils import repo_root


def generate_cover_image_file(title: str) -> str | None:
    """
    DALL-E 3 ile PNG üretir; /images/covers/cover-<id>.png yolunu döndürür.
    Başarısızlıkta None (sessizce veya log ile).
    """
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("[dalle] OPENAI_API_KEY tanımlı değil; kapak atlanıyor.")
        return None

    try:
        from openai import OpenAI
    except ImportError:
        print("[dalle] openai paketi yüklü değil: pip install openai")
        return None

    uid = uuid.uuid4().hex[:16]
    stem = f"cover-{uid}"
    out_dir = repo_root() / "public" / "images" / "covers"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{stem}.png"

    prompt = (
        "Minimalist, corporate legal editorial cover image, abstract and calm. "
        "Suggest justice, law, balance, or civic rights through subtle geometry, soft gradients, "
        "deep blue and slate gray tones. No text, no letters, no logos, no faces, no celebrities, "
        "no national symbols. Professional print quality, wide composition. "
        f"Theme hint (do not render as text): {title[:280]}"
    )

    client = OpenAI(api_key=api_key)
    try:
        res = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",
            quality="standard",
            n=1,
            response_format="b64_json",
        )
    except Exception as e:
        print(f"[dalle] API hatası: {e}")
        return None

    data = res.data
    if not data or not getattr(data[0], "b64_json", None):
        print("[dalle] Boş yanıt.")
        return None

    raw = base64.b64decode(data[0].b64_json)
    out_path.write_bytes(raw)
    public_url = f"/images/covers/{stem}.png"
    print(f"[dalle] Kaydedildi: {public_url}")
    return public_url
