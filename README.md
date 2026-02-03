# MZCE College Chatbot - Flask + GroqAPI

An AI-powered chatbot for Mount Zion College of Engineering using Flask backend and Groq API.

## Features

- **GroqAPI GPT Integration**: Uses model llama-3.3-70b-versatile for intelligent responses
- **Conversation History**: Maintains context within sessions for better responses
- **Flask Backend**: Python-based REST API server
- **CORS Enabled**: Works seamlessly with frontend
- **Session Management**: Unique session IDs for each user

## Prerequisites

- Python 3.8 or higher
- GroqAPI
- pip (Python package manager)

## Installation

### 1. Clone/Download the Project
```bash
cd chatbot3
```

### 2. Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your GROQ API key:
```GROQ_API_KEY=SECRET GROQ API KEY
FLASK_ENV=development
PORT=5000
```

## Running the Application

### Start Flask Server
```bash
python app.py
```

You should see:
```
Flask server running at http://localhost:5000
```

### Access the Chatbot
1. Open [index.html](index.html) in your web browser
2. The chatbot will automatically connect to the Flask backend
3. Start asking questions about the college!

## Project Structure

```
chatbot3/
├── app.py                 # Flask server with OpenAI integration
├── script.js              # Frontend JavaScript (updated for API calls)
├── index.html             # HTML structure
├── style.css              # Styling
├── data.js                # College data (backup/reference)
├── collegeData.json       # College information
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## API Endpoints

### 1. Chat Endpoint
**POST** `/api/chat`

Request:
```json
{
  "message": "What courses do you offer?",
  "sessionId": "session_1234567890_abcdef"
}
```

Response:
```json
{
  "response": "We offer B.Tech, M.Tech, MBA, and MCA programs..."
}
```

### 2. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "Server is running",
  "service": "MZCE Chatbot API"
}
```

### 3. Clear Session
**POST** `/api/clear-session`

Request:
```json
{
  "sessionId": "session_1234567890_abcdef"
}
```

## Troubleshooting

### "Connection error: Make sure Flask server is running"
- Check if Flask is running: `python app.py`
- Verify port 5000 is not blocked
- Ensure CORS is enabled in Flask

### "Failed to get response: Incorrect API key"
- Verify your GROQ API key in `.env`
- Check key is valid at https://console.groq.com/keys
- Ensure no extra spaces/quotes in `.env`

### "Module not found" errors
- Run: `pip install -r requirements.txt`
- Activate virtual environment first

### CORS Issues
- Flask CORS is enabled by default in `app.py`
- If issues persist, ensure frontend is accessing `http://localhost:5000`

## Configuration

Edit `app.py` to customize:

- **Model**: llama-3.3-70b-versatile
- **Temperature**: Adjust creativity (0.0-1.0)
- **Max Tokens**: Limit response length
- **System Prompt**: Modify chatbot personality/instructions

Example:
```python
response = client.chat.completions.create(
     model='llama-3.3-70b-versatile',  # Change model
    temperature=0.7,  # Lower = more factual
    max_tokens=500,  # Longer responses
)
```

## Security Notes

- ⚠️ Never commit `.env` file with real API keys
- Keep API key confidential
- Use `.gitignore` to exclude `.env`
- For production, use environment variable management services

## Development

### Activate Development Mode
```bash
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows
python app.py
```

### Debug Mode
Flask runs in debug mode by default in `app.py`

## Deployment

For production deployment:

1. **Change `debug=False`** in `app.py`:
```python
app.run(debug=False, port=port)
```

2. **Use production WSGI server** (e.g., Gunicorn):
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **Set environment variables** securely
4. **Use HTTPS** in production

## Performance Tips

- Response time: ~1-3 seconds (GROQ API latency)
- Conversation history kept to 20 messages
- Increase `max_tokens` for longer responses (uses more API credits)
- Use  model='llama-3.3-70b-versatile' FREE OPEN SOURCE


## Future Enhancements

- [ ] Add database for persistent conversation history
- [ ] Implement user authentication
- [ ] Add more specific college-related functions
- [ ] Create admin dashboard for analytics
- [ ] Add voice input/output
- [ ] Multi-language support
- [ ] Document storage and RAG (Retrieval Augmented Generation)

## License

MIT License

## Support

For issues or questions:
- Check troubleshooting section
- Review Flask documentation: https://flask.palletsprojects.com/
- GROQ API https://api.groq.com/openai/v1/chat/completions
- Contact college: 0468 - 2216325, 2217425




