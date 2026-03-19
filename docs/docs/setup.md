# Setup

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

From repo root:

```bash
cp .env.example .env
python -m backend.scripts.ingest
uvicorn backend.app.main:app --reload --port 8000
```

## Ollama

```bash
ollama pull llama3.1:8b
ollama serve
```

## Frontend

Open `frontend/vanilla/index.html` in your browser.
