from omnidimension import Client
import json
import os

# Initialize client with API key
api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

# Get phone number and patient info from environment variables or use defaults
TARGET_PHONE = os.getenv('TARGET_PHONE', '+918019227239')  # Default with India country code
PATIENT_NAME = os.getenv('PATIENT_NAME', 'Demo Patient')
SURGERY_TYPE = os.getenv('SURGERY_TYPE', 'General Surgery')
DAYS_POST_OP = os.getenv('DAYS_POST_OP', '3')

# Agent ID for Post-Op Follow-Up (from our previous creation)
POSTOP_FOLLOWUP_AGENT_ID = 2458

def initiate_postop_followup_call():
    """Initiate Post-Op Follow-Up call to the target phone number"""
    print("🚀 Initiating CareConnect Post-Op Follow-Up Call")
    print("=" * 60)
    print(f"📱 Target Phone: {TARGET_PHONE}")
    print(f"👤 Patient Name: {PATIENT_NAME}")
    print(f"🏥 Surgery Type: {SURGERY_TYPE}")
    print(f"📅 Days Post-Op: {DAYS_POST_OP}")
    print(f"🤖 Agent ID: {POSTOP_FOLLOWUP_AGENT_ID}")
    print()
    
    try:
        response = client.call.dispatch_call(
            POSTOP_FOLLOWUP_AGENT_ID,
            TARGET_PHONE,
            {
                "customer_name": PATIENT_NAME,
                "account_id": f"PAT-{TARGET_PHONE.replace('+', '')}",
                "surgery_type": SURGERY_TYPE,
                "days_post_op": DAYS_POST_OP,
                "priority": "high"
            }
        )
        print("📋 API Response:")
        print(json.dumps(response, indent=2))
        # Handle the response format
        if isinstance(response, dict) and 'json' in response:
            call_data = response['json']
            call_id = call_data.get('id')
            status = call_data.get('status', 'Unknown')
            print(f"\n✅ Post-Op Follow-Up call initiated successfully!")
            print(f"   Call ID: {call_id}")
            print(f"   Status: {status}")
            return call_id
        else:
            print(f"\n❌ Unexpected response format")
            return None
    except Exception as e:
        print(f"❌ Error initiating post-op follow-up call: {e}")
        print(f"Error type: {type(e)}")
        return None

def get_call_status(call_id):
    """Get the status of a specific call"""
    if not call_id:
        print("❌ No call ID provided")
        return None
    
    try:
        response = client.call.get(call_id)
        
        if isinstance(response, dict) and 'json' in response:
            call_data = response['json']
            print(f"📞 Call Status for {call_id}:")
            print(f"   Status: {call_data.get('status')}")
            print(f"   Duration: {call_data.get('duration')}")
            print(f"   Summary: {call_data.get('summary')}")
            return call_data
        else:
            print("❌ Unexpected response format for call status")
            return None
            
    except Exception as e:
        print(f"❌ Error getting call status: {e}")
        return None

def list_recent_calls():
    """List recent post-op follow-up calls"""
    try:
        response = client.call.list()
        
        if isinstance(response, dict) and 'json' in response:
            calls = response['json']
            print(f"📋 Recent Calls ({len(calls)} found):")
            print()
            
            for i, call in enumerate(calls, 1):
                print(f"{i}. Call ID: {call.get('id')}")
                print(f"   Agent: {call.get('agent_name', 'N/A')}")
                print(f"   Status: {call.get('status', 'N/A')}")
                print(f"   Duration: {call.get('duration', 'N/A')}")
                print(f"   Created: {call.get('created_at', 'N/A')}")
                print()
        else:
            print("❌ Unexpected response format for call list")
            
    except Exception as e:
        print(f"❌ Error listing calls: {e}")

def main():
    """Main function to handle post-op follow-up calls"""
    print("🏥 CareConnect Post-Op Follow-Up Voice AI")
    print("=" * 60)
    
    # Check if we want to list recent calls or initiate a new one
    action = os.getenv('ACTION', 'initiate')  # Default to initiate call
    
    if action == 'list':
        print("📋 Listing recent post-op follow-up calls...")
        list_recent_calls()
    else:
        # Initiate new post-op follow-up call
        call_id = initiate_postop_followup_call()
        
        if call_id:
            print("\n" + "=" * 60)
            print("✅ Post-Op Follow-Up Call Summary:")
            print(f"   Call ID: {call_id}")
            print(f"   Patient: {PATIENT_NAME}")
            print(f"   Phone: {TARGET_PHONE}")
            print(f"   Surgery: {SURGERY_TYPE}")
            print(f"   Days Post-Op: {DAYS_POST_OP}")
            
            print("\n🎯 Call Features:")
            print("   • Daily pain assessment (0-10 scale)")
            print("   • Mobility and activity level check")
            print("   • Medication adherence verification")
            print("   • Complication detection and escalation")
            print("   • Recovery trend analysis")
            
            print("\n📞 Next Steps:")
            print("   1. Patient will receive the call")
            print("   2. AI will conduct daily assessment")
            print("   3. Results will be logged for healthcare providers")
            print("   4. Escalation if concerns are detected")
            
            # Optionally get call status after a delay
            print(f"\n⏳ Call initiated. You can check status later with call ID: {call_id}")
        else:
            print("\n❌ Failed to initiate post-op follow-up call")
            print("Please check your API key and network connection")

if __name__ == "__main__":
    main() 