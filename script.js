/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = "https://mzc-ai-assistant.onrender.com/api";

let sessionId =
  "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

/* =========================================================
   ON LOAD
========================================================= */

window.addEventListener("load", () => {
  console.log("Chatbot ready | Flask + GroqAI");
  console.log("Session ID:", sessionId);

  // Wake up Render backend
  fetch(`${API_URL}/health`).catch(() => {});
});

/* =========================================================
   CHATBOT OPEN / CLOSE
========================================================= */

function openChatbot() {
  document.getElementById("chatbot").style.display = "flex";
  document.querySelector(".ai-icon").style.display = "none";
}

function closeChatbot() {
  document.getElementById("chatbot").style.display = "none";
  document.querySelector(".ai-icon").style.display = "flex";
}

function toggleEnlarge() {
  document.getElementById("chatbot").classList.toggle("enlarged");
}

/* =========================================================
   SEND MESSAGE (TEXT)
========================================================= */

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendUserMessage(message);
  input.value = "";

  showLoading();
  getBotResponse(message);
}

/* =========================================================
   ENTER KEY (WORKS EVEN DURING RECORDING)
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    if (isRecording && recognition) {
      sendAfterVoice = true;
      recognition.stop();
    } else {
      sendMessage();
    }
  }
});

/* =========================================================
   API CALL
========================================================= */

async function getBotResponse(userMessage) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        sessionId: sessionId,
      }),
    });

    removeLoading();

    if (!response.ok) {
      appendBotMessage("⚠️ Server error. Please try again.");
      return;
    }

    const data = await response.json();
    appendBotMessage(data.response);
  } catch (error) {
    console.error(error);
    removeLoading();
    appendBotMessage("⚠️ Connection error. Server unavailable.");
  }
}

/* =========================================================
   QUICK BUTTONS
========================================================= */

function sendQuick(text) {
  appendUserMessage(text);
  showLoading();
  getBotResponse(text);
}

/* =========================================================
   MESSAGE RENDERING
========================================================= */

function appendUserMessage(text) {
  const chat = document.getElementById("chatBody");
  const div = document.createElement("div");
  div.className = "user-message";
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function appendBotMessage(text) {
  const chat = document.getElementById("chatBody");
  const div = document.createElement("div");
  div.className = "bot-message";
  div.innerHTML = convertUrlsToLinks(text);
  chat.appendChild(div);

  // Readable from TOP
  div.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showLoading() {
  const chat = document.getElementById("chatBody");
  const loading = document.createElement("div");
  loading.className = "bot-message";
  loading.id = "loading-message";
  loading.innerText = "Thinking...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;
}

function removeLoading() {
  document.getElementById("loading-message")?.remove();
}

function convertUrlsToLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    '<a href="$1" target="_blank" style="color:#0066cc;font-weight:600;">$1</a>'
  );
}

/* =========================================================
   NEW CHAT
========================================================= */

function startNewChat() {
  document.getElementById("chatBody").innerHTML = `
    <div class="bot-message welcome">
      <strong>Welcome to Mount Zion College of Engineering!</strong><br>
      I’m ZionX AI Assistant 🤖. How can I assist you today?
    </div>
    <div class="quick-buttons">
      <button onclick="sendQuick('What courses are offered at MZC?')">Courses</button>
      <button onclick="sendQuick('Tell me about placement companies')">Placements</button>
      <button onclick="sendQuick('What are the admission requirements?')">Admission</button>
      <button onclick="sendQuick('Tell me about hostel facilities')">Hostel</button>
    </div>`;
}

/* =========================================================
   VOICE INPUT (SPEECH → TEXT ONLY)
========================================================= */

const voiceBtn = document.getElementById("voiceBtn");
const inputField = document.getElementById("userInput");

let recognition;
let isRecording = false;
let sendAfterVoice = false;

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    inputField.value = event.results[0][0].transcript;

    if (sendAfterVoice) {
      sendAfterVoice = false;
      sendMessage();
    }
  };

  recognition.onend = () => {
    isRecording = false;
    voiceBtn.classList.remove("recording");
    inputField.placeholder = "Write your message...";
  };
}

voiceBtn.addEventListener("click", () => {
  if (!recognition) {
    alert("Voice input not supported");
    return;
  }

  if (!isRecording) {
    recognition.start();
    isRecording = true;
    inputField.placeholder = "Listening… press Enter to send";
    voiceBtn.classList.add("recording");
  }
});
