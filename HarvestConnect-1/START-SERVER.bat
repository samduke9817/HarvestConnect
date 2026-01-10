@echo off
chcp 65001 >nul
title HarvestConnect - Development Server

echo.
echo ============================================
echo    HARVEST CONNECT DEV SERVER
echo ============================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/3] Installing dependencies (first time setup)...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo [DONE] Dependencies installed successfully!
    echo.
) else (
    echo [1/3] Dependencies already installed (skipping)
    echo.
)

REM Initialize database
echo [2/3] Initializing database...
echo.
call npm run db:init
if errorlevel 1 (
    echo.
    echo [WARNING] Database initialization had issues, but continuing...
    echo.
) else (
    echo [DONE] Database initialized!
    echo.
)

REM Start development server
echo [3/3] Starting development server...
echo.
echo ============================================
echo Server starting...
echo Open your browser to: http://localhost:5000
echo Press Ctrl+C to stop the server
echo ============================================
echo.

REM Wait 2 seconds before opening browser
timeout /t 2 /nobreak >nul

REM Open browser automatically
start http://localhost:5000

REM Start the server
npm run dev

REM If server crashes, pause to show error
if errorlevel 1 (
    echo.
    echo [ERROR] Server stopped unexpectedly!
    echo.
    pause
)