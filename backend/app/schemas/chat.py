from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message")
    history: list[ChatMessage] = Field(default_factory=list, description="Optional conversation history")


class SourceChunk(BaseModel):
    source: str
    chunk_id: str
    score: float
    text: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
