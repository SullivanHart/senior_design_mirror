# Use python image
FROM python:3.11-slim

# Set directory
WORKDIR /app

# Init files into container
COPY requirements.txt .
COPY main.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the script
CMD ["python", "main.py"]
