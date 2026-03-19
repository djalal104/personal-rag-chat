from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.rag.generator import answer_with_rag

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        answer, sources = answer_with_rag(req.message, req.history)
        return ChatResponse(answer=answer, sources=sources)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Knowledge base error: {str(e)}")
    except ConnectionError as e:
        raise HTTPException(
            status_code=503, 
            detail=f"Ollama service unavailable: {str(e)}. Make sure Ollama is running on http://localhost:11434"
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
