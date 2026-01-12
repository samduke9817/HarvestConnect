@echo off
chcp 65001 >nul
title HarvestConnect - Production Server

cls
echo ========================================
echo     START PRODUCTION SERVER
echo ========================================
echo.
echo Starting built production server...
echo This serves files from client/dist folder
echo.

cd /d "%~dp0\server"

echo Checking for production server...
if exist "production-server.js" (
    echo Found production server!
    timeout /t 2 /nobreak >nul
    node production-server.js
) else (
    echo ERROR: production-server.js not found!
    echo Please run: npm run build
    pause
    exit /b 1
)

echo.
echo ========================================
echo        SERVER STARTED
echo ========================================
echo.
echo The server is running!
echo Browser should open to: http://localhost:5000
echo.
echo Press Ctrl+C in this window to stop the server
echo ========================================
echo.

timeout /t 999999 /nobreak >nul
