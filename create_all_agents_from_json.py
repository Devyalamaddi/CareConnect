import json
from omnidimension import Client

API_KEY = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(API_KEY)

# Helper for integrations and post_call_config
# (You may need to adjust these if the SDK or API expects different keys)
def create_agent(agent_data):
    kwargs = {
        'name': agent_data['name'],
        'llm_service': agent_data.get('llm_service', 'gpt-4o-mini'),
        'voice_provider': agent_data.get('voice_provider', 'eleven_labs'),
        'voice': agent_data.get('voice', 'cgSgspJ2msm6clMCkdW9'),
        'bot_type': agent_data.get('bot_type', 'prompt'),
        'bot_call_type': agent_data.get('bot_call_type', 'Incoming'),
        'welcome_message': agent_data.get('welcome_message', ''),
        'context_breakdown': agent_data.get('context_breakdown', [
            {"title": agent_data['name'], "body": f"This is the {agent_data['name']} agent."}
        ])
    }
    # Add integrations if present
    if agent_data.get('integrations'):
        kwargs['integrations'] = agent_data['integrations']
    # Add post_call_config if present
    if agent_data.get('post_call_config_ids'):
        kwargs['post_call_config'] = agent_data['post_call_config_ids']
    # Add flow_data if present
    if agent_data.get('flow_data'):
        kwargs['flow_data'] = agent_data['flow_data']
    # Add context_breakdown if present
    if agent_data.get('context_breakdown'):
        kwargs['context_breakdown'] = agent_data['context_breakdown']
    response = client.agent.create(**kwargs)
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Created agent '{agent_data['name']}' with ID: {agent_id}")
    return agent_id

# Define all agents as per the provided JSON (simplified for script)
agents_to_create = [
    {
        "name": "Doctor Appointment Approval Agent",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9",
        "integrations": [
            {
                "id": 840,
                "integration_type": "google_calendar",
                "google_calendar_email": "devendrayalamaddi@gmail.com",
                "google_calendar_name": "Doctors Appointment",
                "google_calendar_access_token": "ya29.a0AS3H6Nydu7HN_rzx93JGpqBO0-i7faMfR7vkdsj9j3sHox357PlxcmIhtjgMTeqpgsX5LCP486bKVYGwfkPeQ8Rx84vthdhyn_6eYiPhsIfJuMagFemlYiyU3ejhy7IYlbt80BeJ_Rd7D-1qJmtB66Tzy1necn0zAVhaUL4DaCgYKAZ0SARASFQHGX2MiNYVpsKHGjpJfPUIbONiK5g0175",
                "google_calendar_refresh_token": "1//06Ba8lQJg8HthCgYIARAAGAYSNwF-L9IrxiaDRUKdC7Vw4FIIY8khZKQKLzHK-sb0JEMgMbdzKW5sXoOtme13XxTgXy_aIxXu4DM",
                "meeting_name": "Booking <> Omnidimension",
                "meeting_duration": "30min",
                "start_time": 9,
                "end_time": 17,
                "name": "Doctors Appointment"
            }
        ],
        "post_call_config_ids": [
            {
                "id": 4761,
                "delivery_method": "Email",
                "destination": "devendrayalamaddi@gmail.com",
                "include_full_conversation": True,
                "include_summary": True
            }
        ]
    },
    {
        "name": "Appointments Agent",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9"
    },
    {
        "name": "Appointments Agent for Patient",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9",
        "flow_data": {"edges": [], "nodes": []}
    },
    {
        "name": "HealthBot",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9",
        "post_call_config_ids": [
            {
                "id": 3890,
                "destination": "devyalamaddi2022@gmail.com",
                "include_extracted_info": True,
                "include_full_conversation": True,
                "include_sentiment": True,
                "include_summary": True,
                "extracted_variables": [
                    {"key": "symptom_details", "description": "Extract or Generate the specific symptoms described by the patient from conversation."},
                    {"key": "specialist_decision", "description": "Assign a medical specialty based on symptoms: 'Classify conversation into a specialty.'"}
                ]
            }
        ]
    },
    {
        "name": "CareConnect Post-Op Follow-Up",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9"
    },
    {
        "name": "CareConnect Med Reminder",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9"
    },
    {
        "name": "CareConnect Symptom Screener",
        "llm_service": "gpt-4o-mini",
        "voice_provider": "eleven_labs",
        "voice": "cgSgspJ2msm6clMCkdW9"
    }
]

new_agent_ids = {}

for agent in agents_to_create:
    agent_id = create_agent(agent)
    new_agent_ids[agent['name']] = agent_id

with open('careconnect_agent_ids_newapi.json', 'w') as f:
    json.dump(new_agent_ids, f, indent=2)

print("\nAll new agent IDs saved to careconnect_agent_ids_newapi.json") 