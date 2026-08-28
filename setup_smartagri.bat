@echo off
title SmartAgri AI Setup & Installer
echo ==========================================================
echo       SmartAgri AI Platform - Setup & Installation
echo ==========================================================
echo.

echo [1/6] Installing Python backend dependencies...
cd /d "%~dp0smartagri\backend"
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/6] Processing raw data...
python scripts\download_and_process_data.py

echo.
echo [3/6] Seeding SQLite database...
python scripts\seed_sqlite_db.py

echo.
echo [4/6] Training ML models (Crop Recommendation & Yield Prediction)...
python scripts\train_crop_recommendation.py
python scripts\train_yield_prediction.py

echo.
echo [5/6] Setting up plant disease vision model...
python scripts\setup_disease_model.py

echo.
echo [6/6] Installing Frontend npm dependencies...
cd /d "%~dp0smartagri\frontend"
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install npm dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================================
echo Setup completed successfully!
echo You can now launch the application using run_smartagri.bat
echo ==========================================================
echo.
pause
