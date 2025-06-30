from flask import Flask, request, jsonify
from omnidimension import Client
import os

app = Flask(__name__)

# Use the API key from your existing code
api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

# Agent IDs
AGENT_IDS = {
    'symptom_screener': 3020,
    'med_reminder': 3019,
    'postop_followup': 3018,
    'healthbot': 3017,
    'appointments': 3015,
    'doctor_approval': 3014
}

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 