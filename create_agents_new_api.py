from omnidimension import Client
import json

# New API key
api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

def create_symptom_screener_agent():
    print("Creating Symptom Screener Agent...")
    response = client.agent.create(
        name="CareConnect Symptom Screener",
        welcome_message="Hello! I'm your CareConnect health assistant. I'm here to help assess your symptoms and provide guidance. Please describe what you're experiencing today.",
        context_breakdown=[
            {
                "title": "Symptom Assessment",
                "body": "You are a healthcare assistant for CareConnect. Your role is to assess patient symptoms, identify emergencies, and provide triage advice."
            }
        ]
    )
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Symptom Screener Agent ID: {agent_id}")
    return agent_id

def create_med_reminder_agent():
    print("Creating Med-Reminder Agent...")
    response = client.agent.create(
        name="CareConnect Med Reminder",
        welcome_message="Hi! This is your CareConnect medication reminder. I'm calling to remind you about your scheduled medication.",
        context_breakdown=[
            {
                "title": "Medication Reminder",
                "body": "You are a medication reminder assistant for CareConnect. Your role is to remind patients to take medications and track adherence."
            }
        ]
    )
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Med-Reminder Agent ID: {agent_id}")
    return agent_id

def create_postop_followup_agent():
    print("Creating Post-Op Follow-Up Agent...")
    response = client.agent.create(
        name="CareConnect Post-Op Follow-Up",
        welcome_message="Hello! This is your CareConnect post-operative follow-up call. I'm checking in on your recovery progress today.",
        context_breakdown=[
            {
                "title": "Post-Op Assessment",
                "body": "You are a post-operative follow-up assistant for CareConnect. Your role is to assess recovery progress and monitor for complications."
            }
        ]
    )
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Post-Op Follow-Up Agent ID: {agent_id}")
    return agent_id

def main():
    print("Creating CareConnect agents with new API key...")
    symptom_id = create_symptom_screener_agent()
    med_id = create_med_reminder_agent()
    postop_id = create_postop_followup_agent()
    print("\nAgent IDs:")
    print(f"Symptom Screener: {symptom_id}")
    print(f"Med-Reminder: {med_id}")
    print(f"Post-Op Follow-Up: {postop_id}")
    # Save to file for reference
    with open('careconnect_agent_ids_newapi.json', 'w') as f:
        json.dump({
            'symptom_screener': symptom_id,
            'med_reminder': med_id,
            'postop_followup': postop_id
        }, f, indent=2)

if __name__ == "__main__":
    main() 