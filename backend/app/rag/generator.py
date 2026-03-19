from __future__ import annotations

import os
import requests
from typing import List

from openrouter import OpenRouter

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
        with OpenRouter(api_key="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") as client:
            response = client.chat.send(
                model="nvidia/nemotron-3-nano-30b-a3b:free",
                messages=messages,
                temperature=settings.LLM_TEMPERATURE,
            )

            answer = response.choices[0].message.content

    except requests.exceptions.RequestException as e:
        raise ConnectionError(f"OpenRouter request failed: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Error calling OpenRouter model: {e}") from e

    return answer, sources
