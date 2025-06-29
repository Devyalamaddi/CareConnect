import json
import os

def get_careconnect_agent_ids_newapi():
    """Get CareConnect agent IDs from the saved JSON file"""
    
    # Check if the agent IDs file exists
    if not os.path.exists('careconnect_agent_ids_newapi.json'):
        print("❌ Agent IDs file not found. Please run the agent creation script first.")
        return None
    
    try:
        with open('careconnect_agent_ids_newapi.json', 'r') as f:
            agent_ids = json.load(f)
        
        print("🚀 CareConnect Agent IDs:")
        print("=" * 40)
        
        for agent_name, agent_id in agent_ids.items():
            print(f"  {agent_name}: {agent_id}")
        
        print("\n📋 Agent Mapping:")
        print("  symptom_screener → CareConnect Symptom Screener")
        print("  med_reminder → CareConnect Med Reminder") 
        print("  postop_followup → CareConnect Post-Op Follow-Up")
        
        return agent_ids
        
    except Exception as e:
        print(f"❌ Error reading agent IDs: {e}")
        return None

def get_agent_id_by_name(agent_name):
    """Get a specific agent ID by name"""
    agent_ids = get_careconnect_agent_ids_newapi()
    
    if agent_ids and agent_name in agent_ids:
        return agent_ids[agent_name]
    else:
        print(f"❌ Agent '{agent_name}' not found")
        return None

if __name__ == "__main__":
    get_careconnect_agent_ids_newapi() 