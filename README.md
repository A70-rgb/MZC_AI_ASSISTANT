Below is your UPDATED README.md, with Voice Input integration using Web Speech API clearly added and professionally documented.
You can replace your existing README completely with this version.

MZC ZIONX AI ASSISTANT
College Chatbot – Flask + GroqAPI + Web Speech API

An AI-powered college chatbot for Mount Zion College of Engineering, developed using a Flask backend, Groq API (LLM), and Web Speech API for voice-based interaction.

Overview

MZC ZIONX AI ASSISTANT is a web-based intelligent chatbot designed to provide instant, accurate, and context-aware responses to college-related queries. The system supports both text and voice input, enabling users to interact naturally with the chatbot. It uses advanced Large Language Models via the Groq API and maintains session-based conversation history for better contextual understanding.

Features

Groq API LLM Integration
Uses the llama-3.3-70b-versatile model for intelligent, human-like responses.

Voice Input Integration (Web Speech API)
Allows users to send queries using voice, which are converted into text and processed by the chatbot.

Text-Based Chat Interface
Supports real-time text messaging through a responsive web UI.

Conversation History Management
Maintains session-based context for improved multi-turn conversations.

Flask Backend
Python-based REST API server for handling chatbot requests.

CORS Enabled
Ensures smooth communication between frontend and backend.

Session Management
Generates unique session IDs for each user interaction.

Prerequisites

Python 3.8 or higher

Groq API key

pip (Python package manager)

Modern web browser (Chrome recommended for Web Speech API support)

Installation
1. Clone / Download the Project
cd chatbot3

2. Create Virtual Environment (Recommended)

Windows

python -m venv venv
venv\Scripts\activate


macOS / Linux

python3 -m venv venv
source venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt

4. Set Up Environment Variables

Create a .env file in the project root:

cp .env.example .env


Edit .env and add:

GROQ_API_KEY=YOUR_GROQ_API_KEY
FLASK_ENV=development
PORT=5000

Running the Application
Start Flask Server
python app.py


Expected output:

Flask server running at http://localhost:5000

Access the Chatbot

Open index.html in a web browser

-The frontend automatically connects to the Flask backend
-Use text input or click the mic button to speak your query
-Chatbot responds with text output
-Voice Input – Web Speech API
-The chatbot supports voice-based query submission using the Web Speech API.
-Spoken input is converted into text in the browser and sent to the Flask backend for AI processing.

⚠️ Note:

-Web Speech API works best in Google Chrome
-Internet connection is required
-Voice recognition depends on browser support

Project Structure
chatbot3/
├── app.py                 # Flask backend server
├── script.js              # Frontend JavaScript (API + Voice handling)
├── index.html             # Chatbot UI
├── style.css              # Styling
├── data.js                # Backup college data
├── collegeData.json       # College information
├── requirements.txt       # Python dependencies
├── .env.example           # Environment template
└── README.md              # Project documentation

API Endpoints
1. Chat Endpoint

POST /api/chat
Request:
{
  "message": "What courses do you offer?",
  "sessionId": "session_1234567890_abcdef"
}
Response:
{
  "response": "We offer B.Tech, M.Tech, MBA, and MCA programs..."
}

2. Health Check

GET /api/health

Response:
{
  "status": "Server is running",
  "service": "MZCE Chatbot API"
}

3. Clear Session

POST /api/clear-session
Request:
{
  "sessionId": "session_1234567890_abcdef"
}

Configuration

-Modify app.py to customize chatbot behavior:
-Model: llama-3.3-70b-versatile
-Temperature: Controls creativity (0.0 – 1.0)
-Max Tokens: Response length
-System Prompt: Chatbot personality

Example:

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    max_tokens=500
)

Security Notes:

-⚠️ Never commit the .env file
-Keep your Groq API key confidential
-Use .gitignore to exclude sensitive files
-Use secure environment variable management in production
-Deployment
 For production use:
"pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app"
-Disable debug mode
-Use HTTPS
-Set environment variables securely

Performance

-Average response time: 1–3 seconds
-Session memory limited to last 20 messages
-Increasing max_tokens increases response length and API usage
-Uses FREE & OPEN-SOURCE LLaMA model via Groq

Future Enhancements

-Persistent database storage
-User authentication and roles
-Admin dashboard & analytics
-Voice output (Text-to-Speech)
-Multi-language support
-Document-based RAG integration

License

-MIT License

Support

-Flask Docs: https://flask.palletsprojects.com/
-Groq Docs: https://console.groq.com/docs
-Web Speech API: https://developer.mozilla.org/
-Mount Zion College: 0468 – 2216325, 2217425







