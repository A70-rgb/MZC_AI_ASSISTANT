from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Initialize Groq client
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# System prompt for the college chatbot
SYSTEM_PROMPT = """You are a helpful chatbot assistant for Mount Zion College of Engineering. You have comprehensive knowledge about:

Leadership:
- Dr. K J Abraham Kalamannil (Chairman, Mount Zion Group)
- Dr. D F Melvin Jose (Principal)
- Joseph Abraham (Board Member)
- Samuel Abraham (Board Member)
- Suja Joseph (Board Member)
- K.K. Jose (Director)

Departments & Heads of Department (HODs):
- Civil Engineering: Lincy Elsa Varghese
- Computer Science & Engineering (CSE): Dr. Smita C Thomas
- Applied Electronics: Dr. Thomas George
- Aeronautical Engineering: Dr. Pradeep Kumar S
- Master of Business Administration (MBA): Babitha Elsa Oommen
- Master Computer Applications (MCA): Bevi Mariam Koshy
- Basic Sciences: Sudheeesh S R

Academic Information:
- Courses offered: B.Tech (CSE, ECE, Mechanical, Civil, AE, AE&I), M.Tech, MBA, MCA
- Placement information (Google, Amazon, Microsoft, TCS, Infosys, Wipro, HCL, Accenture, Tech Mahindra, Cognizant, IBM, etc.)
- Fee structures and scholarships
- Hostel facilities and transportation
- Campus events and activities
- Location: Kadammanitta, Pathanamthitta, Kerala
- AICTE Approved, NAAC Accredited, Affiliated to KTU

Established Year Of Departments
    "Computer Science Engineering:2001",
    "Electronics & Communication Engineering:2001",
    "Mechanical Engineering:2014",
    "Civil Engineering:2001",
    "Applied Electronics & Instrumentation:2001",
    "Aeronautical Engineering:2009",
    "MBA Department:2006",
    "MCA Department:2009"

Fees for each department
    "btech": "₹30000 per semester (may vary in CS around 65000 per semester)",
    "mtech": "₹2.5 - 3.5 Lakhs per annum",
    "mba": "₹Around 2.75-3 Lakhs for the full course",
    "mca": "₹20000 per semester",
    "note": "For detailed fee structure and scholarships, contact admission office",
    "contact": "0468 - 2216325, 2217425"


timings
    "college":"9:00 AM - 4:00 PM",
    "bus":"Arrives at 9AM Departures at 4:10PM",
    "hostel":"Entry before 6:30PM",
    "class":"9:10AM - 4:00PM",
    "canteen":"10:50AM-11:00AM morning,12:40PM-1:30PM Lunch(1:00PM-2:00PM on Friday),3:00PM-3:10PM Evening"

Duration
"2 years with 4 semeseters" - "MCA","MBA" and "MTECH"
"4 years with 8 semesters" - "Computer Science Engineering","Electronics & Communication Engineering",
    "Mechanical Engineering","Civil Engineering","Applied Electronics & Instrumentation","Aeronautical Engineering"


Provide accurate, helpful, and friendly responses. If you don't know specific details, suggest contacting the college directly.

For admission-related queries, refer to: https://www.mzce.ac.in/xyzer/index.php

General Information & Website:
Main Website: https://www.mzce.ac.in/
location:https://maps.app.goo.gl/XdrKzuXpHMEZ3eV76
Exam Website: https://ktu.edu.in/exam/notification
Result Website: https://app.ktu.edu.in/login.htm
Exam Registration:https://app.ktu.edu.in/login.htm
Phone: 0468 - 2216325, 2217425
Email:https://contactmountzion@gmail.com
/mzcengg@gmail.com/contact@mzce.ac.in

"""

# Store conversation history for context
conversation_history = {}


@app.route('/')
def serve_index():
    """Serve index.html"""
    return send_from_directory('.', 'index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses"""
    try:
        data = request.json
        message = data.get('message', '').strip()
        session_id = data.get('sessionId', 'default')

        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400

        # Initialize conversation history for this session
        if session_id not in conversation_history:
            conversation_history[session_id] = []

        # Add user message to history
        conversation_history[session_id].append({
            'role': 'user',
            'content': message
        })

        # Keep only last 20 messages for context (to avoid token limits)
        if len(conversation_history[session_id]) > 20:
            conversation_history[session_id] = conversation_history[session_id][-20:]

        # Call Groq API
        response = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                *conversation_history[session_id]
            ],
            temperature=0.7,
            max_tokens=500
        )

        bot_message = response.choices[0].message.content

        # Add bot response to history
        conversation_history[session_id].append({
            'role': 'assistant',
            'content': bot_message
        })

        return jsonify({'response': bot_message}), 200

    except Exception as error:
        print(f'Error: {str(error)}')
        return jsonify({'error': f'Failed to get response: {str(error)}'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'Server is running', 'service': 'MZCE Chatbot API'}), 200


@app.route('/api/clear-session', methods=['POST'])
def clear_session():
    """Clear conversation history for a session"""
    try:
        data = request.json
        session_id = data.get('sessionId')

        if session_id and session_id in conversation_history:
            del conversation_history[session_id]
            return jsonify({'message': 'Session cleared successfully'}), 200
        else:
            return jsonify({'error': 'Session not found'}), 404

    except Exception as error:
        return jsonify({'error': str(error)}), 500



if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'Flask server running on port {port}')
    print('Make sure GROQ_API_KEY is set in .env file')
    print('Using Groq API with llama-3.3-70b-versatile model')
    app.run(host='0.0.0.0', port=port)


