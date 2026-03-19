from __future__ import annotations

from pathlib import Path
from tqdm import tqdm

from app.core.config import settings
from app.rag.chunking import chunk_text
from app.rag.embeddings import EmbeddingModel
from app.rag.vectorstore import get_collection


SUPPORTED_EXT = {".md", ".txt"}


def load_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def iter_docs(raw_dir: Path):
    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXT:
            yield p


def ingest_raw_dir(raw_dir: str = "backend/data/raw"):
    raw_path = Path(raw_dir)
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw data folder not found: {raw_path.resolve()}")

    collection = get_collection()
    embedder = EmbeddingModel(settings.EMBED_MODEL_NAME)

    # (Optional) clear collection if you want a clean rebuild:
    # collection.delete(where={})

    docs = list(iter_docs(raw_path))
    if not docs:
        print(f"No documents found in {raw_path.resolve()} (supported: {SUPPORTED_EXT})")
        return

    ids, texts, metas = [], [], []

    for doc in tqdm(docs, desc="Reading & chunking"):
        text = load_text(doc)
        chunks = chunk_text(text)

        for i, ch in enumerate(chunks):
            chunk_id = f"{doc.as_posix()}::chunk_{i:04d}"
            ids.append(chunk_id)
            texts.append(ch)
            metas.append({"source": doc.as_posix(), "chunk": i})

    print(f"Total chunks: {len(texts)}")

    # Embed in batches to avoid RAM spikes
    batch = 64
    for i in tqdm(range(0, len(texts), batch), desc="Embedding & storing"):
        b_texts = texts[i:i+batch]
        b_ids = ids[i:i+batch]
        b_metas = metas[i:i+batch]
        b_emb = embedder.embed(b_texts)

        # Upsert: if ids already exist, Chroma will raise; simplest is to delete first.
        # Here we do a safe approach: try delete then add for those ids.
        try:
            collection.delete(ids=b_ids)
        except Exception:
            pass

        collection.add(ids=b_ids, documents=b_texts, metadatas=b_metas, embeddings=b_emb)

    print("Done. Chroma index stored at:", settings.CHROMA_PATH)


if __name__ == "__main__":
    ingest_raw_dir()
