from omnidimension import Client
import json
import os

# Initialize client with API key
api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

# Get phone number from environment variable or use default
TARGET_PHONE = os.getenv('TARGET_PHONE', '+918019227239')  # Default with India country code
PATIENT_NAME = os.getenv('PATIENT_NAME', 'Demo Patient')

# Agent ID for Symptom Screener (from our previous creation)
SYMPTOM_SCREENER_AGENT_ID = 2456

def initiate_symptom_screener_call():
    """Initiate Symptom Screener call to the target phone number"""
    print("🚀 Initiating CareConnect Symptom Screener Call")
    print("=" * 50)
    print(f"📱 Target Phone: {TARGET_PHONE}")
    print(f"👤 Patient Name: {PATIENT_NAME}")
    print(f"🤖 Agent ID: {SYMPTOM_SCREENER_AGENT_ID}")
    print()
    
    # Call context with patient information
    call_context = {
        "customer_name": PATIENT_NAME,
        "account_id": f"PAT-{TARGET_PHONE.replace('+', '')}",
        "priority": "high"
    }
    
    try:
        response = client.call.dispatch_call(
            SYMPTOM_SCREENER_AGENT_ID,
            TARGET_PHONE,
            call_context
        )
        print("📋 API Response:")
        print(json.dumps(response, indent=2))
        
        # Handle the response format
        if isinstance(response, dict) and 'json' in response:
            call_data = response['json']
            call_id = call_data.get('id')
            status = call_data.get('status', 'Unknown')
            print(f"\n✅ Call initiated successfully!")
            print(f"   Call ID: {call_id}")
            print(f"   Status: {status}")
            return call_id
        else:
            print(f"\n❌ Unexpected response format")
            return None
            
    except Exception as e:
        print(f"❌ Error initiating call: {e}")
        print(f"Error type: {type(e)}")
        return None

if __name__ == "__main__":
    call_id = initiate_symptom_screener_call()
    
    if call_id:
        print(f"\n🎉 Symptom Screener call initiated successfully!")
        print(f"📞 Call ID: {call_id}")
        print(f"📱 Phone: {TARGET_PHONE}")
        print(f"👤 Patient: {PATIENT_NAME}")
    else:
        print(f"\n❌ Failed to initiate call") 