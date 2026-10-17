# XavierProject

A beginner-friendly project for learning platform engineering and CI/CD.

## Application

A simple Python application that prints a status message.

## Run locally

```powershell
python .\src\app.py
```

## Run tests

```powershell
python -m pytest -v
```

## Build Docker image

```powershell
docker build -t xavierproject:local .
```

## Run Docker container

```powershell
docker run --rm xavierproject:local
```