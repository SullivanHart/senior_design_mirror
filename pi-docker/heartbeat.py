from datetime import datetime
import json
from pathlib import Path
import time

import g_cnstnts
import db

# --- Constants ---
CAM_CNFG_FILE = Path.home() / "unipark" / "cams_cnfg.json"
STATUS_GOOD = "GOOD" # Functioning as intended #Change to ints instead?
STATUS_DOWN_CAMS = "DOWN_CAMS" # Some cameras are offline
STATUS_NO_CAMS = "NO_CAMS" # No cameras configured

# --- Main Loop ---
def main():

    while( True ):
        # --- Initialize ---
        state = json.loads('{}') # Change to default w/ all fields
        state['status'] = STATUS_GOOD

        # Read config info for lot ID
        id = db.getLotID()
        # If not  found
        if ( id == g_cnstnts.INVLD_LOT_ID ):
            # Wait
            time.sleep(10)
            # Continue (try again)
            continue

        # Check for # of configured cams
        num_cams = db.getNumCams()
        # If there are some cams
        if (num_cams == 0):
            # Read database for each cams' last updated time
            db.getLastUpdt(0)
            # If none
                # Send NO_CAMS status
                # Wait correct time
                # Continue (try again)

        # Check for down cams
            # Read database for each last_updated time
                # If some
                    # Send DOWN_CAMS status
                    # Attach list of down cams
                    # Wait correct time
                    # Continue (try again)

        # Send good status
            # Wait some time
            # Continue (try again)

# -- Run main --
if __name__ == "__main__":
    main()