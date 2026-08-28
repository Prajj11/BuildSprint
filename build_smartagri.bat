@echo off
title SmartAgri AI - Build & Test
echo ==========================================================
echo        SmartAgri AI Platform - Build & Test Suite
echo ==========================================================
echo.

echo [1/2] Running Backend API Tests (pytest)...
cd /d "%~dp0smartagri\backend"
python -m pytest
if errorlevel 1 (
    echo [ERROR] Backend tests failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Building Frontend Production Assets (npm run build)...
cd /d "%~dp0smartagri\frontend"
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================================
echo Build and tests completed successfully!
echo Production assets built in: smartagri\frontend\dist
echo ==========================================================
echo.
pause
