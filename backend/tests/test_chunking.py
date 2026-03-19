from backend.app.rag.chunking import chunk_text

def test_chunk_text_basic():
    text = "A\n\nB\n\nC" * 200
    chunks = chunk_text(text, chunk_size=200, overlap=50)
    assert len(chunks) >= 2
    assert all(isinstance(c, str) and len(c) > 0 for c in chunks)
