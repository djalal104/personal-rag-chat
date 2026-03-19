from __future__ import annotations

import requests
from typing import Any


class OllamaClient:
    def __init__(self, base_url: str, model: str, temperature: float = 0.2, timeout_s: int = 120):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.temperature = temperature
        self.timeout_s = timeout_s

    def chat(self, messages: list[dict[str, str]]) -> str:
        url = f"{self.base_url}/api/chat"
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": self.temperature},
        }
        r = requests.post(url, json=payload, timeout=self.timeout_s)
        r.raise_for_status()
        data = r.json()
        return data.get("message", {}).get("content", "").strip()
