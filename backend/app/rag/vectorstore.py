from __future__ import annotations

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import settings


def get_collection() -> Collection:
    client = chromadb.PersistentClient(path=settings.CHROMA_PATH)
    # cosine space works well for normalized embeddings
    collection = client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )
    return collection
