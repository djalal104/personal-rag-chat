# Architecture

## High-level flow

1. Documents live in `backend/data/raw/`
2. Ingestion script:
   - loads docs
   - chunks them
   - builds embeddings
   - stores into Chroma (`backend/data/index/chroma`)
3. Chat endpoint:
   - embeds the user query
   - retrieves top-k chunks
   - builds a context prompt
   - asks the LLM (OpenRouter)
   - returns answer + sources

## Suggested improvements

- Hybrid retrieval: BM25 + dense vectors
- Reranking with a cross-encoder
- Better chunking (token-based, semantic)
- Source-aware prompting and citations
