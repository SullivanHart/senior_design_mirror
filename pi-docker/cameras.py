from datetime import datetime
import transmit

def read_cam(cam):
    print(f"Image {cam['id']} read")
    cam['last_updt'] = transmit.now_iso()
    return True