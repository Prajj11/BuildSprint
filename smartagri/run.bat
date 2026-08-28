@echo off
title SmartAgri AI Launcher
echo ==========================================================
echo           SmartAgri AI Platform Launch Script
echo ==========================================================
echo.
echo Starting FastAPI Backend and React/Vite Frontend...
echo.

:: Launch Backend Server
cd /d "%~dp0backend"
start "SmartAgri Backend (FastAPI - Port 8000)" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Launch Frontend Dev Server
cd /d "%~dp0frontend"
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
