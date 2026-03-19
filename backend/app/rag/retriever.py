from __future__ import annotations

from dataclasses import dataclass

from app.core.config import settings
from app.rag.embeddings import EmbeddingModel
from app.rag.vectorstore import get_collection


@dataclass
class RetrievedChunk:
    source: str
    chunk_id: str
    score: float
    text: str


def retrieve(query: str, top_k: int | None = None) -> list[RetrievedChunk]:
    top_k = top_k or settings.TOP_K

    collection = get_collection()
    embedder = EmbeddingModel(settings.EMBED_MODEL_NAME)
    q_emb = embedder.embed([query])[0]

    res = collection.query(
        query_embeddings=[q_emb],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    # Chroma returns lists per query (we have 1 query)
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[]])[0]  # smaller is closer for cosine distance in chroma

    out: list[RetrievedChunk] = []
    for idx, (doc, meta, dist) in enumerate(zip(docs, metas, dists)):
        source = (meta or {}).get("source", "unknown")
        # Convert distance to a pseudo-score (higher is better).
        score = float(1.0 - dist) if dist is not None else 0.0
        chunk_id = f"chunk_{idx}"  # Generate chunk ID from index
        out.append(RetrievedChunk(source=source, chunk_id=chunk_id, score=score, text=str(doc)))

    return out
