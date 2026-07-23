from __future__ import annotations

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# config.py lives at backend/app/core/config.py
# .env lives at the project root (3 levels up)
_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_ENV_FILE = _PROJECT_ROOT / ".env"


class Settings(BaseSettings):
    APP_NAME: str = "Personal RAG Chatbot"

    # Frontend origins allowed (CSV)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5500,http://127.0.0.1:5173,http://localhost:5173,http://localhost:8000,http://127.0.0.1:8000,http://127.0.0.1:8080"

    # Embeddings
    EMBED_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Chroma
    CHROMA_PATH: str = "backend/data/index/chroma"
    CHROMA_COLLECTION: str = "personal_kb"

    # Retrieval
    TOP_K: int = 5
    MAX_CONTEXT_CHARS: int = 12000

    # LLM provider
    LLM_PROVIDER: str = "openrouter"
    
    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "nvidia/nemotron-3-ultra-550b-a55b:free"
    
    LLM_TEMPERATURE: float = 0.2

    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), extra="ignore")


settings = Settings()
