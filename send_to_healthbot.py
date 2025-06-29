from omnidimension import Client
import os
import json

api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

AGENT_ID = int(os.getenv('AGENT_ID', '2461'))
USER_MESSAGE = os.getenv('USER_MESSAGE', '')
PATIENT_NAME = os.getenv('PATIENT_NAME', 'Demo Patient')

if not USER_MESSAGE:
    print(json.dumps({"error": "No user message provided"}))
    exit(1)

try:
    # Send the message to the agent (simulate chat)
    response = client.agent.chat(
        agent_id=AGENT_ID,
        message=USER_MESSAGE,
        context={"customer_name": PATIENT_NAME}
    )
    # Print the agent's response (final response)
    if isinstance(response, dict) and 'json' in response:
        print(json.dumps(response['json'], indent=2))
    else:
        print(json.dumps(response, indent=2))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    exit(1) 