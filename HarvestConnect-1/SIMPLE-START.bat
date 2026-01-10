@echo off
chcp 65001 >nul
title HarvestConnect - Simple Start

cls
echo ========================================
echo    SIMPLE SERVER START
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if dependencies exist...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
    echo Dependencies installed!
)

echo.
echo Setting up database...
call npm run db:push
if errorlevel 1 (
    echo WARNING: Database setup had issues, but continuing...
)

echo.
echo Starting server...
echo Browser will open to: http://localhost:5000
echo.
echo Press Ctrl+C to stop server
echo ========================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5000

npm run dev

if errorlevel 1 (
    echo.
    echo ========================================
    echo    SERVER FAILED TO START
    echo ========================================
    echo.
    echo Possible issues:
    echo 1. Port 5000 already in use
    echo 2. Node.js not installed
    echo 3. Dependencies missing
    echo 4. Database error
    echo.
    echo To check for issues:
    echo - Look at error messages above
    echo - Try closing other Node processes
    echo.
    pause
)