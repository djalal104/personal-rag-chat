# API

FastAPI auto-generates OpenAPI docs at:

- `http://localhost:8000/docs`

Endpoints:

- `GET /health`
- `POST /api/chat`

## POST /api/chat

Request:
```json
{
  "message": "Where do I study?",
  "history": [{"role": "user", "content": "Hi"}]
}
```

Response:
```json
{
  "answer": "You study at ENSIA ...",
  "sources": [
    {"source": "backend/data/raw/about_me.md", "chunk_id": "...", "score": 0.82, "text": "..."}
  ]
}
```
