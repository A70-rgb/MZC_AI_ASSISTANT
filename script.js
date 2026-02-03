// Flask API configuration
const API_URL = 'http://localhost:5000/api';
let sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Load when page starts
window.addEventListener('load', () => {
    console.log('Chatbot ready. Backend: Flask + GroqAI');
    console.log('Session ID:', sessionId);
});

function openChatbot() {
    document.getElementById("chatbot").style.display = "flex";
    document.querySelector(".ai-icon").style.display = "none";
}

function closeChatbot() {
    document.getElementById("chatbot").style.display = "none";
    document.querySelector(".ai-icon").style.display = "flex";
}

function toggleEnlarge() {
    let chatbot = document.getElementById("chatbot");
    chatbot.classList.toggle("enlarged");
}

function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value.trim();
    if (!message) return;

    appendUserMessage(message);
    input.value = "";

    // Show loading indicator
    let chat = document.getElementById("chatBody");
    let loadingDiv = document.createElement("div");
    loadingDiv.className = "bot-message";
    loadingDiv.id = "loading-message";
    loadingDiv.innerText = "Thinking...";
    chat.appendChild(loadingDiv);
    chat.scrollTop = chat.scrollHeight;

    // Call Flask API
    getBotResponse(message);
}
//enter key to send message
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});


async function getBotResponse(userMessage) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                sessionId: sessionId
            })
        });

        // Remove loading indicator
        let loadingDiv = document.getElementById("loading-message");
        if (loadingDiv) {
            loadingDiv.remove();
        }

        if (!response.ok) {
            const error = await response.json();
            appendBotMessage(`Error: ${error.error || 'Failed to get response'}`);
            return;
        }

        const data = await response.json();
        appendBotMessage(data.response);

    } catch (error) {
        console.error('Error:', error);
        
        // Remove loading indicator
        let loadingDiv = document.getElementById("loading-message");
        if (loadingDiv) {
            loadingDiv.remove();
        }

        appendBotMessage(`⚠️ Connection error: Make sure Flask server is running at ${API_URL}`);
    }
}

function sendQuick(text) {
    appendUserMessage(text);
    
    let chat = document.getElementById("chatBody");
    let loadingDiv = document.createElement("div");
    loadingDiv.className = "bot-message";
    loadingDiv.id = "loading-message";
    loadingDiv.innerText = "Thinking...";
    chat.appendChild(loadingDiv);
    chat.scrollTop = chat.scrollHeight;

    getBotResponse(text);
}

function appendUserMessage(text) {
    let chat = document.getElementById("chatBody");
    let div = document.createElement("div");
    div.className = "user-message";
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function appendBotMessage(text) {
    let chat = document.getElementById("chatBody");
    let div = document.createElement("div");
    div.className = "bot-message";
    // Convert URLs to clickable links
    div.innerHTML = convertUrlsToLinks(text);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function convertUrlsToLinks(text) {
    // Regex to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Replace URLs with clickable links in blue color
    return text.replace(urlRegex, '<a href="$1" target="_blank" style="color: #0066cc; text-decoration: underline; font-weight: 600;">$1</a>');
}

function startNewChat() {
    document.getElementById("chatBody").innerHTML = `
        <div class="bot-message welcome"><strong>Welcome to Mount Zion College of Engineering!</strong>
            <br>I’m ZionX AI Assistant 🤖. How can I assist you today?
        </div>
        <div class="quick-buttons">
            <button onclick="sendQuick('What courses are offered at MZC?')">Courses</button>
            <button onclick="sendQuick('Tell me about placement companies')">Placements</button>
            <button onclick="sendQuick('What are the admission requirements?')">Admission</button>
            <button onclick="sendQuick('Tell me about hostel facilities')">Hostel</button>
        </div>`;
}

function openFeedback() {
    document.getElementById("feedbackModal").style.display = "flex";
}

function closeFeedback() {
    document.getElementById("feedbackModal").style.display = "none";
}

function submitFeedback() {
    let feedback = document.getElementById("feedbackText").value.trim();
    if (!feedback) {
        alert("Please enter feedback");
        return;
    }
    alert("Thank you for your feedback!");
    document.getElementById("feedbackText").value = "";
    closeFeedback();
}

