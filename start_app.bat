@echo off
echo Starting ML Analytics...

echo [1/2] Mettre à jour et démarrer le Backend...
start "Backend" cmd.exe /k "cd backend && py -m venv venv && call venv\Scripts\activate.bat && py -m pip install -r requirements.txt && py -m uvicorn main:app --reload"

echo [2/2] Mettre à jour et démarrer le Frontend...
start "Frontend" cmd.exe /k "cd frontend && npm install && npm start"

echo Les services sont en cours de démarrage dans de nouvelles fenêtres !
