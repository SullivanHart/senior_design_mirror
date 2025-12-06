FROM python:3.11-slim

# Install uv
RUN pip install --no-cache-dir uv

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies via uv (reads pyproject.toml or requirements.txt)
RUN uv sync --frozen

# Run the project using uv (faster than python)
CMD ["uv", "run", "main.py"]
