FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt .

# Install build dependencies for Alpine
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    musl-dev \
    python3-dev \
    && pip install --no-cache-dir -r requirements.txt \
    && apk del .build-deps

COPY . .

# Create data directory if it doesn't exist
RUN mkdir -p /app/data

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
