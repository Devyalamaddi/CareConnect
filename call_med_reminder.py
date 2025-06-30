from omnidimension import Client
import json
import os
import time

# Initialize client with API key
api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

# Agent ID for Med-Reminder (from new API)
MED_REMINDER_AGENT_ID = 2457

# Get phone number and patient info from environment variables or use defaults
TARGET_PHONE = os.getenv('TARGET_PHONE', '+918019227239')  # Default with India country code
PATIENT_NAME = os.getenv('PATIENT_NAME', 'Demo Patient')
MEDICINE_NAME = os.getenv('MEDICINE_NAME', 'Fever Medicine')
DOSAGE = os.getenv('DOSAGE', '1 tablet')
REMINDER_TIME = os.getenv('REMINDER_TIME', '20:00')  # 8pm in 24h format


def initiate_med_reminder_call():
    """Initiate Med-Reminder call for fever medicine at 8pm and hang up after 10 seconds"""
    print("🚀 Initiating CareConnect Med-Reminder Call")
    print("=" * 60)
    print(f"📱 Target Phone: {TARGET_PHONE}")
    print(f"👤 Patient Name: {PATIENT_NAME}")
    print(f"💊 Medicine: {MEDICINE_NAME}")
    print(f"🕗 Reminder Time: {REMINDER_TIME}")
    print(f"🤖 Agent ID: {MED_REMINDER_AGENT_ID}")
    print()

    # Call context for the reminder
    call_context = {
        "customer_name": PATIENT_NAME,
        "account_id": f"PAT-{TARGET_PHONE.replace('+', '')}",
        "medicine_name": MEDICINE_NAME,
        "dosage": DOSAGE,
        "reminder_time": REMINDER_TIME,
        "priority": "high"
    }

    try:
        response = client.call.dispatch_call(
            MED_REMINDER_AGENT_ID,
            TARGET_PHONE,
            call_context
        )
        print("📋 API Response:")
        print(json.dumps(response, indent=2))

        # Handle the response format
        call_id = None
        if isinstance(response, dict) and 'json' in response:
            call_data = response['json']
            call_id = call_data.get('id')
            status = call_data.get('status', 'Unknown')
            print(f"\n✅ Med-Reminder call initiated successfully!")
            print(f"   Call ID: {call_id}")
            print(f"   Status: {status}")
        else:
            print(f"\n❌ Unexpected response format")
            return None

        # Wait 10 seconds, then hang up the call
        if call_id:
            print(f"\n⏳ Waiting 10 seconds before hanging up the call...")
            time.sleep(10)
            print(f"🔔 Hanging up call ID: {call_id}")
            try:
                hangup_response = client.call.hangup(call_id)
                print(f"✅ Call hung up successfully. Response:")
                print(json.dumps(hangup_response, indent=2))
            except Exception as e:
                print(f"❌ Error hanging up call: {e}")
        return call_id
    except Exception as e:
        print(f"❌ Error initiating med-reminder call: {e}")
        print(f"Error type: {type(e)}")
        return None

if __name__ == "__main__":
    call_id = initiate_med_reminder_call()
    if call_id:
        print(f"\n🎉 Med-Reminder call initiated and hung up after 10 seconds!")
        print(f"📞 Call ID: {call_id}")
        print(f"📱 Phone: {TARGET_PHONE}")
        print(f"👤 Patient: {PATIENT_NAME}")
    else:
        print(f"\n❌ Failed to initiate med-reminder call") 