# Use python image
FROM python:3.11-slim

# Set directory
WORKDIR /app

# Init files into container
COPY requirements.txt .
COPY heartbeat.py .
COPY g_cnstnts.py .
COPY db.py .
COPY transmit.py .
COPY server.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the script
CMD ["python", "main.py"]
CMD ["python", "server.py"]

