from __future__ import annotations

import re


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = 900, overlap: int = 150) -> list[str]:
    """
    Simple chunking by characters with overlap.
    - chunk_size: approximate max chunk length
    - overlap: repeated tail from previous chunk to keep continuity

    This is intentionally simple. For best results, move to token-based chunking later.
    """
    text = normalize_whitespace(text)
    if not text:
        return []

    chunks: list[str] = []
    start = 0
    n = len(text)

    while start < n:
        end = min(start + chunk_size, n)

        # try to cut on paragraph boundary if possible
        cut = text.rfind("\n\n", start, end)
        if cut != -1 and cut > start + chunk_size * 0.5:
            end = cut

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # move start with overlap
        start = max(end - overlap, end)

    return chunks
