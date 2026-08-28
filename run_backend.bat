@echo off
title SmartAgri AI Backend Server
echo ==========================================================
echo             SmartAgri AI - Backend Server
echo ==========================================================
echo.

cd /d "%~dp0smartagri\backend"

echo Checking Python dependencies...
python -m pip install -r requirements.txt >nul 2>&1

echo Seeding SQLite database...
python scripts/seed_sqlite_db.py

echo.
echo Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
echo API Documentation: http://127.0.0.1:8000/docs
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

pause
