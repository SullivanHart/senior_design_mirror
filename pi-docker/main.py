import time
from datetime import datetime

print("CONTAINER IS RUNNING V3!", flush=True)

while True:
    print(f"[{datetime.now()}] Running inside the container...", flush=True)
    time.sleep(5)