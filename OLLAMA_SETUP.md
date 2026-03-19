# Ollama Setup Guide

## What is Ollama?
Ollama is a tool to run large language models locally on your machine. The RAG chatbot uses Ollama to generate answers based on your knowledge base.

## Step 1: Install Ollama

### Windows
1. Download from: https://ollama.ai/download/windows
2. Run the installer
3. Ollama will automatically start as a background service

### macOS
```bash
# Download and install from: https://ollama.ai/download/mac
# Or use Homebrew:
brew install ollama
```

### Linux
```bash
curl https://ollama.ai/install.sh | sh
```

## Step 2: Start Ollama

### Windows
- Ollama starts automatically when you install it
- Check if running: Look for Ollama icon in system tray
- Or start manually: Open PowerShell and run:
```powershell
ollama serve
```

### macOS / Linux
```bash
ollama serve
```

The service will run on `http://localhost:11434`

## Step 3: Pull a Model

Open a **new terminal** (keep the server running in the other one):

```bash
ollama pull llama3.1:8b
```

Options:
- `llama3.1:8b` - 8B parameters (recommended for 8GB+ RAM)
- `llama2:7b` - 7B parameters (lighter)
- `mistral:7b` - 7B parameters (faster)
- `neural-chat:7b` - Optimized for chat

**This downloads the model (~3-5GB depending on size)**

## Step 4: Test Ollama

Once the model is downloaded, test it:

```bash
ollama run llama3.1:8b "Who are you?"
```

You should get a response like:
```
I'm Claude, an AI assistant created by Anthropic. How can I help you today?
```

## Step 5: Run the Chatbot

Now you can run the chatbot:

1. **Backend is running**: `http://127.0.0.1:8000`
2. **Ollama is running**: `http://localhost:11434`
3. **Open**: `http://127.0.0.1:8000/docs`
4. **Test the chat endpoint** with a message

## Troubleshooting

### "Failed to connect to Ollama"
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Should return: `{"models":[...]}`
- If connection refused: Start Ollama with `ollama serve`

### "Model not found"
- Make sure you pulled the model: `ollama pull llama3.1:8b`
- Check available models: `ollama list`

### Memory issues
- If you get out-of-memory errors, use a smaller model:
  ```bash
  ollama pull llama2:7b
  # Then update backend/app/core/config.py:
  # OLLAMA_MODEL = "llama2:7b"
  ```

## Configuration

To change the model, edit [backend/app/core/config.py](backend/app/core/config.py):

```python
OLLAMA_MODEL: str = "llama3.1:8b"  # Change this line
OLLAMA_BASE_URL: str = "http://localhost:11434"  # Ollama server URL
LLM_TEMPERATURE: float = 0.2  # Lower = more focused, Higher = more creative
```

## Performance Notes

- **First run**: Will download the model (3-10GB depending on model size)
- **Response time**: 10-30 seconds per response (depends on model and hardware)
- **Memory**: Needs 8GB+ RAM for smooth operation with 7B models
- **GPU support**: Ollama can use GPU if available (much faster)

## Next Steps

Once Ollama is running:
1. Go to `http://127.0.0.1:8000/docs`
2. Click "Try it out" on POST /api/chat
3. Send a message like: `{"message": "Who are you?", "history": []}`
4. You should get a response from the LLM based on your knowledge base!
