@echo off
title SmartAgri AI Frontend App
echo ==========================================================
echo             SmartAgri AI - Frontend App
echo ==========================================================
echo.

cd /d "%~dp0smartagri\frontend"

if not exist node_modules (
    echo Installing Node dependencies for frontend...
    call npm install
)

echo.
echo Starting React/Vite Frontend Application on http://127.0.0.1:5173 ...
echo.
npm run dev -- --host 127.0.0.1 --port 5173

pause
