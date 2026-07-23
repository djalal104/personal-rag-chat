from __future__ import annotations

import os
import requests
from typing import List


from app.core.config import settings
from app.schemas.chat import ChatMessage, SourceChunk
from app.rag.prompts import SYSTEM_PROMPT
from app.rag.retriever import retrieve


def build_context(chunks: List[SourceChunk], max_chars: int) -> str:
    """Concatenate top chunks, clipped to max_chars."""
    parts: list[str] = []
    total = 0

    for ch in chunks:
        block = f"[{ch.chunk_id}] (source: {ch.source})\n{ch.text}\n"
        if total + len(block) > max_chars:
            break
        parts.append(block)
        total += len(block)

    return "\n\n".join(parts)


def answer_with_rag(user_message: str, history: list[ChatMessage]):
    # 1. Retrieve documents
    retrieved = retrieve(user_message, top_k=settings.TOP_K)

    sources: list[SourceChunk] = [
        SourceChunk(
            source=r.source,
            chunk_id=r.chunk_id,
            score=r.score,
            text=r.text,
        )
        for r in retrieved
    ]

    # 2. Build context
    context = build_context(sources, settings.MAX_CONTEXT_CHARS)

    # 3. Build messages
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Optional: include last 6 turns of chat history
    for m in history[-6:]:
        messages.append({"role": m.role, "content": m.content})

    messages.append(
        {
            "role": "user",
            "content": (
                "Answer the question using the context below.\n\n"
                f"Context:\n{context}\n\n"
                f"Question: {user_message}"
            ),
        }
    )

    # 4. Call OpenRouter
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.OPENROUTER_MODEL,
            "messages": messages,
            "temperature": settings.LLM_TEMPERATURE
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        resp.raise_for_status()
        answer = resp.json()["choices"][0]["message"]["content"]

    except requests.exceptions.HTTPError as e:
        # Surface the actual error from OpenRouter (e.g. 401 invalid key)
        try:
            detail = e.response.json().get("error", {}).get("message", str(e))
        except Exception:
            detail = str(e)
        raise ConnectionError(f"OpenRouter API error: {detail}") from e
    except requests.exceptions.RequestException as e:
        raise ConnectionError(f"OpenRouter request failed: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Error calling OpenRouter model: {e}") from e

    return answer, sources
