# Personal RAG Chatbot (Your Info → Chat)

This project is a **Retrieval-Augmented Generation (RAG)** chatbot that answers questions about *you* using your own documents (CV, portfolio, project notes, certificates, etc.).

It is built as a small monorepo:

- **backend**: FastAPI + Chroma (vector DB) + SentenceTransformers (embeddings) + Ollama (local LLM)
- **frontend**: a tiny vanilla web chat UI (you can replace it with Next.js later)
- **docs**: MkDocs documentation template

---

## 1) What RAG means here

Instead of “training” a model on your personal data, we:

1. **Ingest** your documents → split them into chunks
2. Convert chunks into vectors (**embeddings**) and store them in a vector DB (Chroma)
3. At chat time: embed the user question → retrieve the most relevant chunks
4. Give those chunks to the LLM → LLM answers **only using the retrieved context**
5. Return an answer + **sources** (file + chunk ids)

This keeps your system:
- easier to update (just re-ingest docs),
- cheaper than fine-tuning for personal info,
- more transparent (you can show citations).

---

## 2) Quickstart (Local)

### Prereqs
- Python 3.11+
- (Recommended) `uv` or `pip`
- Ollama installed (for local LLM): https://ollama.com

### 2.1 Install backend deps
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2.2 Configure env
At repo root:
```bash
cp .env.example .env
```

### 2.3 Add your personal docs
Put your files in:
```
backend/data/raw/
```

Supported now: `.md`, `.txt` (you can extend to PDF later).

### 2.4 Ingest docs (build vector index)
From repo root:
```bash
python -m backend.scripts.ingest
```

### 2.5 Run Ollama
Pull a model and start Ollama:
```bash
ollama pull llama3.1:8b
ollama serve
```

### 2.6 Run the API
From repo root:
```bash
uvicorn backend.app.main:app --reload --port 8000
```

Open:
- API docs: http://localhost:8000/docs
- health: http://localhost:8000/health

---

## 3) Run the frontend (simple)
Open `frontend/vanilla/index.html` in your browser.

(If you want a dev server later, use Vite/Next.js and point it to `http://localhost:8000`.)

---

## 4) Typical questions to test
- “Where do I study?”
- “What are my interests?”
- “Summarize my profile in 3 bullets.”
- “List my projects and what each one does.”

---

## 5) Documentation site
This repo includes a MkDocs template in `docs/`.

To build locally:
```bash
pip install mkdocs mkdocs-material
mkdocs serve -f docs/mkdocs.yml
```

---

## 6) Next steps (recommended)
- Add **PDF ingestion**
- Add **hybrid retrieval** (BM25 + vectors)
- Add a **reranker** for better precision
- Add **evaluation** (golden Q/A tests)
- Replace vanilla frontend with **Next.js**
