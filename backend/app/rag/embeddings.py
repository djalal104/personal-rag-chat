from __future__ import annotations

from sentence_transformers import SentenceTransformer


class EmbeddingModel:
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)

    def embed(self, texts: list[str]) -> list[list[float]]:
        # normalize_embeddings=True makes cosine similarity equivalent to dot product
        vectors = self.model.encode(texts, normalize_embeddings=True)
        return vectors.tolist()
