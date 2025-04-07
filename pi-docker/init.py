from datetime import datetime
import json
from pathlib import Path

def network():
    print("Hotspot created")
    # create hotspot
    # only allow certain mac addresses

def cams(path):
    # Default camera config file
    dflt_cng = {
        "cams" : []
    }

    cams = []

    # Try openinig and reading
    try: 
        # Ensure parent directory exists
        path.parent.mkdir(parents=True, exist_ok=True)

        # Create if not found
        if not path.exists():
            with open(path, 'w') as file:
                json.dump(dflt_cng, file, indent=2)
            print(f"Created default config file at {path}")
            #Fill from server
 
        # Get cam config file
        with open(path, 'r') as file:
            data = json.load(file)

        # Extract list of cams
        cams = data['cams']

        return cams
    
    except Exception as e:
        print(f"[{datetime.now().isoformat()}] Error: {e}")
        return cams