from flask import Flask, request, jsonify
from omnidimension import Client
import os
import requests
import base64
from dotenv import load_dotenv
from PIL import Image as PILImage
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.media import Image as AgnoImage
# import hashlib
# import redis

load_dotenv()

app = Flask(__name__)

# Use the API key from your existing code
api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

# Agent IDs
AGENT_IDS = {
    'symptom_screener': 3256,
    'med_reminder': 3257,
    'postop_followup': 3258,
    'healthbot': 3259,
    'appointments': 3261,
    'doctor_approval': 3262
}

# ✅ Optional: Redis for Caching
# r = redis.Redis(
#     host='localhost',  # or Redis Cloud host
#     port=6379,
#     decode_responses=True
# )
# def get_cache_key(image_bytes):
#     return "gemini:xray:" + hashlib.sha256(image_bytes).hexdigest()

# Set your API Key (from env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("⚠️ Please set your Google API Key in GEMINI_API_KEY")
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY

medical_agent = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    tools=[DuckDuckGoTools()],
    markdown=True
)

query = """
You are a highly skilled medical imaging expert with extensive knowledge in radiology and diagnostic imaging. Analyze the medical image and structure your response as follows:

**Make sure to check if the provided image is X-Ray/MRI/CT scan or not, if the provided image is other than these three categories say so, don't do any analysis**

### 1. Image Type & Region
- Identify imaging modality (X-ray/MRI/CT/Ultrasound/etc.).
- Specify anatomical region and positioning.
- Evaluate image quality and technical adequacy.

### 2. Key Findings
- Highlight primary observations systematically.
- Identify potential abnormalities with detailed descriptions.
- Include measurements and densities where relevant.

### 3. Diagnostic Assessment
- Provide primary diagnosis with confidence level.
- List differential diagnoses ranked by likelihood.
- Support each diagnosis with observed evidence.
- Highlight critical/urgent findings.

### 4. Patient-Friendly Explanation
- Simplify findings in clear, non-technical language.
- Avoid medical jargon or provide easy definitions.
- Include relatable visual analogies.
- **Use a kind, empathetic, and supportive tone. Reassure the patient and offer encouragement, especially if findings may be concerning.**

### 5. Research Context
- Use DuckDuckGo search to find recent medical literature.
- Search for standard treatment protocols.
- Provide 2-3 key references supporting the analysis.

**Always include all sections above, even if you are unsure. If you cannot provide a section, write a short, supportive message for the patient in that section.**

Ensure a structured and medically accurate response using clear markdown formatting. Do not include any text outside these sections.
"""

@app.route('/call-patient', methods=['POST'])
def call_patient():
    data = request.json
    phone = data['phoneNumber']
    agent_id = data.get('agent_id', AGENT_IDS['appointments'])
    context = {"role": "patient"}
    response = client.call.dispatch_call(agent_id, phone, context)
    return jsonify(response)

@app.route('/call-doctor', methods=['POST'])
def call_doctor():
    data = request.json
    phone = data['phoneNumber']
    agent_id = data.get('agent_id', AGENT_IDS['doctor_approval'])
    context = {
        "role": "doctor",
        "condition": data.get('condition', 'serious fever'),
        "booking_date": data.get('booking_date'),
        "booking_time": data.get('booking_time')
    }
    response = client.call.dispatch_call(agent_id, phone, context)
    return jsonify(response)

@app.route('/call-symptom-screener', methods=['POST'])
def call_symptom_screener():
    data = request.json
    phone = data['phoneNumber']
    patient_name = data.get('patientName', 'Demo Patient')
    context = {
        "customer_name": patient_name,
        "account_id": f"PAT-{phone.replace('+', '')}",
        "priority": "high"
    }
    response = client.call.dispatch_call(AGENT_IDS['symptom_screener'], phone, context)
    return jsonify(response)

@app.route('/call-med-reminder', methods=['POST'])
def call_med_reminder():
    data = request.json
    phone = data['phoneNumber']
    patient_name = data.get('patientName', 'Demo Patient')
    medicine_name = data.get('medicineName', 'Paracetamol')
    dosage = data.get('dosage', '1 tablet')
    reminder_time = data.get('reminderTime', '20:00')
    context = {
        "customer_name": patient_name,
        "account_id": f"PAT-{phone.replace('+', '')}",
        "medicine_name": medicine_name,
        "dosage": dosage,
        "reminder_time": reminder_time,
        "priority": "high"
    }
    response = client.call.dispatch_call(AGENT_IDS['med_reminder'], phone, context)
    return jsonify(response)

@app.route('/call-postop-followup', methods=['POST'])
def call_postop_followup():
    data = request.json
    phone = data['phoneNumber']
    patient_name = data.get('patientName', 'Demo Patient')
    surgery_type = data.get('surgeryType', 'General Surgery')
    days_post_op = data.get('daysPostOp', '3')
    context = {
        "customer_name": patient_name,
        "account_id": f"PAT-{phone.replace('+', '')}",
        "surgery_type": surgery_type,
        "days_post_op": days_post_op,
        "priority": "high"
    }
    response = client.call.dispatch_call(AGENT_IDS['postop_followup'], phone, context)
    return jsonify(response)

@app.route('/chat-healthbot', methods=['POST'])
def chat_healthbot():
    data = request.json
    agent_id = AGENT_IDS['healthbot']
    user_message = data.get('message', '')
    patient_name = data.get('patientName', 'Demo Patient')
    if not user_message:
        return jsonify({"error": "No user message provided"}), 400
    try:
        response = client.agent.chat(
            agent_id=agent_id,
            message=user_message,
            context={"customer_name": patient_name}
        )
        if isinstance(response, dict) and 'json' in response:
            return jsonify(response['json'])
        else:
            return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-call-status', methods=['POST'])
def get_call_status():
    data = request.json
    call_id = data.get('call_id')
    if not call_id:
        return jsonify({"error": "No call_id provided"}), 400
    try:
        response = client.call.get(call_id)
        if isinstance(response, dict) and 'json' in response:
            return jsonify(response['json'])
        else:
            return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/list-agents', methods=['GET'])
def list_agents():
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))
        response = client.agent.list(page=page, page_size=page_size)
        if isinstance(response, dict) and 'json' in response:
            return jsonify(response['json'])
        else:
            return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-call-logs', methods=['GET'])
def get_call_logs():
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))
        response = client.call.get_call_logs(page=page, page_size=page_size, agent_id="3015")
        if isinstance(response, dict) and 'json' in response:
            return jsonify(response['json'])
        else:
            return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-xray', methods=['POST'])
def analyze_xray():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save and resize image
    temp_path = "temp_image.png"
    file.save(temp_path)
    image = PILImage.open(temp_path)
    width, height = image.size
    aspect_ratio = width / height
    new_width = 500
    new_height = int(new_width / aspect_ratio)
    resized_image = image.resize((new_width, new_height))
    resized_path = "temp_resized_image.png"
    resized_image.save(resized_path)

    agno_image = AgnoImage(filepath=resized_path)
    try:
        response = medical_agent.run(query, images=[agno_image])
        result = response.content
    except Exception as e:
        result = f"⚠️ Analysis error: {e}"
    finally:
        os.remove(temp_path)
        os.remove(resized_path)

    return jsonify({'gemini': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 