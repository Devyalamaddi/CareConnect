from omnidimension import Client
import os
import json

api_key = "vk41WvacSEBtDIyywl95m-o545tkoZt5lMtSg4Fcj2M"
client = Client(api_key)

all_agent_ids = []
page = 1
page_size = 10

while True:
    response = client.agent.list(page=page, page_size=page_size)
    bots = response['json']['bots'] if isinstance(response, dict) and 'json' in response and 'bots' in response['json'] else []
    if not bots or len(bots) == 0:
        break
    for agent in bots:
        if isinstance(agent, dict):
            agent_id = agent.get('id')
            if agent_id:
                all_agent_ids.append(agent_id)
    if len(bots) < page_size:
        break
    page += 1

print("All agent IDs:")
for agent_id in all_agent_ids:
    print(agent_id)

# Existing logic (optional, for reference)
# all_agent_ids = []
# agents = response['json'] if isinstance(response, dict) and 'json' in response else response
# for agent in agents:
#     if isinstance(agent, dict):
#         agent_id = agent.get('id')
#         if agent_id:
#             all_agent_ids.append(agent_id)
# print("All agent IDs:")
# for agent_id in all_agent_ids:
#     print(agent_id) 