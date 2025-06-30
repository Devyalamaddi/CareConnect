from omnidimension import Client
import json

# API key from existing setup
api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

def create_appointments_agent():
    print("Creating Appointments Agent...")
    response = client.agent.create(
        name="Appointments Agent",
        welcome_message="Hello! I'm your CareConnect appointments assistant. I'm here to help you book doctor appointments.",
        context_breakdown=[
            {
                "title": "Appointment Booking",
                "body": "You are a voice agent that helps book doctor appointments. For patients: Ask them about their symptoms and health condition. For doctors: Inform them that a patient has a specific condition and ask for available appointment date and time. Be professional, empathetic, and efficient in collecting necessary information."
            }
        ]
    )
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Appointments Agent ID: {agent_id}")
    return agent_id

def create_doctor_approval_agent():
    print("Creating Doctor Appointment Approval Agent...")
    response = client.agent.create(
        name="Doctor Appointment Approval Agent",
        welcome_message="Hello Doctor! This is CareConnect. A patient is experiencing serious fever and has requested an appointment on {booking_date} at {booking_time}. Do you approve this booking? If not, please state your available date and time for the appointment.",
        context_breakdown=[
            {
                "title": "Doctor Appointment Approval",
                "body": "You are a voice agent that calls doctors to confirm patient appointments. State the patient's condition, mention the requested booking date and time, and ask the doctor for approval. If the doctor does not approve, ask for their available date and time."
            }
        ]
    )
    agent_id = response['json']['id'] if isinstance(response, dict) and 'json' in response and 'id' in response['json'] else None
    print(f"Doctor Appointment Approval Agent ID: {agent_id}")
    return agent_id

def main():
    print("Creating Appointments Agent...")
    appointments_id = create_appointments_agent()
    print("Creating Doctor Appointment Approval Agent...")
    doctor_approval_id = create_doctor_approval_agent()
    
    # Load existing agent IDs
    try:
        with open('careconnect_agent_ids_newapi.json', 'r') as f:
            existing_agents = json.load(f)
    except FileNotFoundError:
        existing_agents = {}
    
    # Add new agent IDs
    existing_agents['appointments'] = appointments_id
    existing_agents['doctor_approval'] = doctor_approval_id
    
    # Save updated agent IDs
    with open('careconnect_agent_ids_newapi.json', 'w') as f:
        json.dump(existing_agents, f, indent=2)
    
    print(f"\nAppointments Agent ID: {appointments_id}")
    print(f"Doctor Appointment Approval Agent ID: {doctor_approval_id}")
    print("Agent IDs saved to careconnect_agent_ids_newapi.json")

if __name__ == "__main__":
    main() 