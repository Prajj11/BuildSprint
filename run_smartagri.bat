@echo off
title SmartAgri AI Launcher
echo ==========================================================
echo           SmartAgri AI Platform Launch Script
echo ==========================================================
echo.

cd /d "%~dp0smartagri\backend"
echo Checking Python dependencies...
python -m pip install -r requirements.txt >nul 2>&1

echo Seeding database and ensuring models exist...
python scripts/seed_sqlite_db.py
python scripts/train_crop_recommendation.py
python scripts/train_yield_prediction.py
python scripts/setup_disease_model.py

echo Starting FastAPI Backend...
start "SmartAgri Backend (FastAPI - Port 8000)" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

cd /d "%~dp0smartagri\frontend"
if not exist node_modules (
    echo Installing Node dependencies for frontend...
    call npm install
)

echo Starting React/Vite Frontend...
start "SmartAgri Frontend (Vite - Port 5173)" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ==========================================================
echo SmartAgri AI platform is now starting in two new terminals!
echo.
echo 🌐 Frontend App:    http://127.0.0.1:5173
echo ⚙️ Backend API Docs: http://127.0.0.1:8000/docs
echo ==========================================================
echo.
pause
