# Dockerfile for the todo backend API.
# Build: docker build -t todo-backend -f backend/Dockerfile backend
# Run:   docker run -p 8000:8000 --env-file backend/.env todo-backend
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
