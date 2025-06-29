import os
import sys
from omnidimension import Client
import json

api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

# Default Appointments Agent ID (from careconnect_agent_ids_newapi.json)
DEFAULT_APPOINTMENTS_AGENT_ID = 2729
DOCTOR_APPROVAL_AGENT_ID = 2730

def call_patient(phone_number):
    print(f"Calling patient at {phone_number}...")
    call_context = {
        "role": "patient"
    }
    response = client.call.dispatch_call(DEFAULT_APPOINTMENTS_AGENT_ID, phone_number, call_context)
    print("Call response:", response)
    return response

def call_doctor(phone_number, condition, agent_id=None, booking_date=None, booking_time=None):
    print(f"Calling doctor at {phone_number} about condition: {condition}...")
    call_context = {
        "role": "doctor",
        "condition": condition
    }
    if booking_date:
        call_context["booking_date"] = booking_date
    if booking_time:
        call_context["booking_time"] = booking_time
    agent_id = int(agent_id) if agent_id else DOCTOR_APPROVAL_AGENT_ID
    response = client.call.dispatch_call(agent_id, phone_number, call_context)
    print("Call response:", response)
    return response

def main():
    phone_number = os.environ.get("TARGET_PHONE")
    role = os.environ.get("ROLE", "patient")
    condition = os.environ.get("CONDITION", "serious fever")
    agent_id = os.environ.get("AGENT_ID")
    booking_date = os.environ.get("BOOKING_DATE")
    booking_time = os.environ.get("BOOKING_TIME")

    if not phone_number:
        print("No phone number provided.", file=sys.stderr)
        sys.exit(1)

    if role == "doctor":
        call_doctor(phone_number, condition, agent_id, booking_date, booking_time)
    else:
        call_patient(phone_number)

if __name__ == "__main__":
    main() 