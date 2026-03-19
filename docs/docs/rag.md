# RAG Details

## Embeddings intuition

An embedding is a vector representation of text. Similar meanings produce vectors that are close under cosine similarity.

Cosine similarity:

\[
\cos(\theta) = \frac{q \cdot d}{\|q\|\|d\|}
\]

We store chunk vectors in a vector DB and retrieve the closest ones to the query vector.

## Chunking

Chunking matters because the LLM can only read a limited context window. Too big chunks → retrieval is less precise. Too small chunks → context loses meaning.
