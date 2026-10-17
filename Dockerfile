FROM python:3.13-slim

WORKDIR /app

COPY src/ .

CMD ["python", "app.py"]