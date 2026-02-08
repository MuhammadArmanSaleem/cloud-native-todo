# Phase IV – Todo Chatbot Backend
FROM python:3.12-slim

WORKDIR /app

# System deps if needed (e.g. for asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Load .env.local at runtime if present; env vars override
ENV PYTHONUNBUFFERED=1
EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
