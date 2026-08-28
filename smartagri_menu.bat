@echo off
title SmartAgri AI - Interactive Control Center
cl:
echo ==========================================================
echo           SmartAgri AI Platform Control Center
echo ==========================================================
echo.
echo Please select an option:
echo.
echo   [1] Start Both Servers (Backend + Frontend)
echo   [2] Start Backend Server Only
echo   [3] Start Frontend Dev Server Only
echo   [4] Full System Setup & Database Seeding
echo   [5] Setup and Immediately Start Application
echo   [6] Run Automated Tests & Build Production Assets
echo   [7] Exit
echo.
echo ==========================================================
set /p choice="Enter option [1-7]: "

if "%choice%"=="1" goto run_both
if "%choice%"=="2" goto run_backend
if "%choice%"=="3" goto run_frontend
if "%choice%"=="4" goto setup_only
if "%choice%"=="5" goto setup_and_run
if "%choice%"=="6" goto build_test
if "%choice%"=="7" exit /b 0

echo Invalid choice. Please try again.
pause
goto start

:run_both
echo Launching Backend and Frontend...
call "%~dp0run_backend.bat"
call "%~dp0run_frontend.bat"
goto end

:run_backend
call "%~dp0run_backend.bat"
goto end

:run_frontend
call "%~dp0run_frontend.bat"
goto end

:setup_only
call "%~dp0setup_smartagri.bat"
goto end

:setup_and_run
call "%~dp0setup_and_run.bat"
goto end

:build_test
call "%~dp0build_smartagri.bat"
goto end

:end
echo.
echo Operation finished.
pause
