const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("msg");
const themeToggle = document.getElementById("themeToggle");
const suggestionBtns = document.querySelectorAll(".suggestion-btn");
const sendButton = form.querySelector(".send-button");

let history = [];
let isLoading = false;

// Theme Toggle
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark-mode";
  document.body.className = savedTheme;
}

themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.contains("dark-mode");
  if (isDarkMode) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light-mode");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark-mode");
  }
});

function addMessage(role, content, sources = []) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;

  const messageDiv = document.createElement("div");
  messageDiv.innerText = content;
  div.appendChild(messageDiv);

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function setLoading(loading) {
  isLoading = loading;
  sendButton.disabled = loading;
  sendButton.style.opacity = loading ? "0.6" : "1";
}

async function sendMessage(text) {
  // Prevent multiple concurrent requests
  if (isLoading) return;

  text = text.trim();
  if (!text) return;

  setLoading(true);
  addMessage("user", text);
  history.push({ role: "user", content: text });
  input.value = "";

  try {
    const resp = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    addMessage("assistant", data.answer, data.sources || []);
    history.push({ role: "assistant", content: data.answer });
  } catch (err) {
    console.error("Chat error:", err);
    addMessage("assistant", `Error: ${err.message}`);
  } finally {
    setLoading(false);
    input.focus();
  }
}

// Form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await sendMessage(input.value);
});

// Attach click handlers to suggestion buttons
suggestionBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const question = btn.getAttribute("data-question");
    if (question && !isLoading) {
      await sendMessage(question);
    }
  });
});

// Initialize theme on page load
initTheme();
