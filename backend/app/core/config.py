from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Personal RAG Chatbot"

    # Frontend origins allowed (CSV)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5500,http://127.0.0.1:5173,http://localhost:8000,http://127.0.0.1:8000,http://127.0.0.1:8080"

    # Embeddings
    EMBED_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Chroma
    CHROMA_PATH: str = "backend/data/index/chroma"
    CHROMA_COLLECTION: str = "personal_kb"

    # Retrieval
    TOP_K: int = 5
    MAX_CONTEXT_CHARS: int = 12000

    # LLM provider
    LLM_PROVIDER: str = "ollama"  # currently implemented: "ollama"

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral:7b"
    LLM_TEMPERATURE: float = 0.2

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
