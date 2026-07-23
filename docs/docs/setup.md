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

## OpenRouter
Ensure you have set the `OPENROUTER_API_KEY` in your `.env` file to authenticate with OpenRouter.

## Frontend

Open `frontend/vanilla/index.html` in your browser.
