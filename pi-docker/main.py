from datetime import datetime
import json
from pathlib import Path
import time

import cameras
import init
import inference
import transmit

# --- Constants ---
CAM_CNFG_FILE = Path.home() / "unipark" / "cams_cnfg.json"
STATUS_GOOD = "GOOD" # change to ints instead?
STATUS_NO_CAMS = "NO_CAMS" # change to ints instead?
STATUS_BAD = "BAD"

# --- Main Loop ---
def main():
    # --- Initialize ---
    state = json.loads('{}')
    state['status'] = STATUS_GOOD

    init.network() # handle errors

    cams = init.cams(CAM_CNFG_FILE) 
    if len(cams) == 0:
        state['status'] = STATUS_NO_CAMS

    # -- Loop -- 
    while True:
        # Catch Error status
        while(state['status'] != STATUS_GOOD):
            print("ERROR: INCORRECT STATUS")
            # Send Error to Server
            time.sleep(10)

        # Read each cam
        for cam in cams:
            cameras.read_cam(cam)
            inference.read_img(cam)
        
        state['cams'] = cams

        # Send status to server
        response = transmit.send_state(state)
        print(f"[{datetime.now()}] Response: {response.status_code} {response.content}")

# -- Run main --
if __name__ == "__main__":
    main()