# Evaluation

For personal chatbots, you want to test both:

1. **Retrieval quality**
2. **Answer faithfulness** (no hallucinations)

## Practical approach
- Create a small `tests/golden_qa.json` with ~30 real questions you care about.
- For each question:
  - check if the retrieved context contains the answer
  - check if the answer cites relevant sources
  - verify it says “I don't know” when docs are missing

Over time, this becomes your regression suite.
