FROM python:3.10-slim-bullseye

WORKDIR /app

# Install system dependencies with retries
RUN apt-get update && \
    apt-get install -y --no-install-recommends -o Acquire::Retries=3 \
    wkhtmltopdf \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
