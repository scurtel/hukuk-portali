from __future__ import annotations

from pathlib import Path

from db_utils import repo_root


def load_all_env() -> None:
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    root = repo_root()
    load_dotenv(root / ".env")
    load_dotenv(root / ".env.local")
    load_dotenv(root / "automation" / ".env")
