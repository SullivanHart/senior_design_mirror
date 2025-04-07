from datetime import datetime, timezone
import requests
import json

def send_state(state):
    print(f"Sending to server: {json.dumps(state)}")
    response = requests.get('http://sddec25-09e.ece.iastate.edu:8080/test')
    return response

def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
