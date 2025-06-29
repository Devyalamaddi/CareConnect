from omnidimension import Client
import json
import os

# Initialize client with API key
api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

# Target phone number
TARGET_PHONE = "8019227239"

def load_agent_ids():
    """Load agent IDs from the JSON file"""
    if not os.path.exists('careconnect_agent_ids.json'):
        print("❌ Agent IDs file not found. Please run the agent creation script first.")
        return None
    
    try:
        with open('careconnect_agent_ids.json', 'r') as f:
            agent_ids = json.load(f)
        return agent_ids
    except Exception as e:
        print(f"❌ Error loading agent IDs: {e}")
        return None

def initiate_call(agent_id, agent_name, phone_number):
    """Initiate a call using the specified agent"""
    print(f"📞 Initiating {agent_name} call to {phone_number}...")
    
    try:
        response = client.call.create(
            agent_id=agent_id,
            phone_number=phone_number,
            # Optional: Add call metadata
            metadata={
                "call_type": agent_name,
                "patient_phone": phone_number,
                "system": "CareConnect"
            }
        )
        
        # Handle the response format
        if isinstance(response, dict) and 'json' in response:
            call_data = response['json']
            call_id = call_data.get('id')
            status = call_data.get('status', 'Unknown')
            print(f"✅ Call initiated successfully!")
            print(f"   Call ID: {call_id}")
            print(f"   Status: {status}")
            return call_id
        else:
            print(f"📋 Full API Response:")
            print(json.dumps(response, indent=2))
            return None
            
    except Exception as e:
        print(f"❌ Error initiating call: {e}")
        return None

def initiate_symptom_screener_call(phone_number):
    """Initiate Symptom Screener call"""
    agent_ids = load_agent_ids()
    if not agent_ids:
        return None
    
    agent_id = agent_ids.get('symptom_screener')
    if not agent_id:
        print("❌ Symptom Screener agent ID not found")
        return None
    
    return initiate_call(agent_id, "Symptom Screener", phone_number)

def initiate_med_reminder_call(phone_number):
    """Initiate Med-Reminder call"""
    agent_ids = load_agent_ids()
    if not agent_ids:
        return None
    
    agent_id = agent_ids.get('med_reminder')
    if not agent_id:
        print("❌ Med-Reminder agent ID not found")
        return None
    
    return initiate_call(agent_id, "Med-Reminder", phone_number)

def initiate_postop_followup_call(phone_number):
    """Initiate Post-Op Follow-Up call"""
    agent_ids = load_agent_ids()
    if not agent_ids:
        return None
    
    agent_id = agent_ids.get('postop_followup')
    if not agent_id:
        print("❌ Post-Op Follow-Up agent ID not found")
        return None
    
    return initiate_call(agent_id, "Post-Op Follow-Up", phone_number)

def initiate_all_calls(phone_number):
    """Initiate all three types of calls"""
    print("🚀 Initiating CareConnect Voice AI Calls")
    print("=" * 50)
    print(f"📱 Target Phone: {phone_number}")
    print()
    
    agent_ids = load_agent_ids()
    if not agent_ids:
        print("❌ Could not load agent IDs")
        return
    
    print("📋 Available Agents:")
    for name, agent_id in agent_ids.items():
        print(f"  {name}: {agent_id}")
    print()
    
    call_results = {}
    
    # Initiate Symptom Screener call
    print("1️⃣ Symptom Screener Call:")
    call_id = initiate_symptom_screener_call(phone_number)
    call_results['symptom_screener'] = call_id
    print()
    
    # Initiate Med-Reminder call
    print("2️⃣ Med-Reminder Call:")
    call_id = initiate_med_reminder_call(phone_number)
    call_results['med_reminder'] = call_id
    print()
    
    # Initiate Post-Op Follow-Up call
    print("3️⃣ Post-Op Follow-Up Call:")
    call_id = initiate_postop_followup_call(phone_number)
    call_results['postop_followup'] = call_id
    print()
    
    # Summary
    print("=" * 50)
    print("📊 Call Initiation Summary:")
    for call_type, call_id in call_results.items():
        status = "✅ Success" if call_id else "❌ Failed"
        print(f"  {call_type}: {status} (ID: {call_id})")
    
    # Save call results
    with open('call_results.json', 'w') as f:
        json.dump(call_results, f, indent=2)
    print(f"\n💾 Call results saved to: call_results.json")

def main():
    """Main function"""
    print("🚀 CareConnect Voice AI Call Initiator")
    print("=" * 50)
    
    # Use the specified phone number
    phone_number = TARGET_PHONE
    
    print("Choose an option:")
    print("1. Initiate Symptom Screener call")
    print("2. Initiate Med-Reminder call") 
    print("3. Initiate Post-Op Follow-Up call")
    print("4. Initiate all calls")
    print("5. Exit")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == "1":
        initiate_symptom_screener_call(phone_number)
    elif choice == "2":
        initiate_med_reminder_call(phone_number)
    elif choice == "3":
        initiate_postop_followup_call(phone_number)
    elif choice == "4":
        initiate_all_calls(phone_number)
    elif choice == "5":
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice. Please run the script again.")

if __name__ == "__main__":
    main() 