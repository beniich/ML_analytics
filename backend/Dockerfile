# backend/Dockerfile
FROM python:3.12-slim-bookworm

# Variables d'environnement pour optimiser Python en conteneur
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    APP_HOME=/app

WORKDIR $APP_HOME

# Dépendances système de base
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    wkhtmltopdf \
    && rm -rf /var/lib/apt/lists/*

# Copie & Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copie du code applicatif
COPY . .

# Utilisateur non-root pour la sécurité
RUN useradd -m -r appuser && \
    chown -R appuser:appuser $APP_HOME
USER appuser

# Exposition du port
EXPOSE 8000

# Démarrage optimisé Gunicorn + Uvicorn workers
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "--access-logfile", "-", "--error-logfile", "-"]
