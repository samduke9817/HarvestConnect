@echo off
chcp 65001 >nul
title HarvestConnect - Simple Fix and Start

cls
echo ============================================
echo     SIMPLE FIX AND START
echo ============================================
echo.

cd /d "%~dp0"

echo [Step 1] Stopping ALL Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo [Step 2] Deleting old database...
del /F harvestconnect.db* 2>nul
timeout /t 1 /nobreak >nul

echo [Step 3] Creating fresh database schema...
node create-db.mjs
if errorlevel 1 (
    echo ERROR: Failed to create database schema
    pause
    exit /b 1
)

echo [Step 4] Seeding test users...
node test-db.mjs
if errorlevel 1 (
    echo WARNING: Seeding may have failed, but continuing...
)

echo [Step 5] Starting Backend...
start "HarvestConnect Backend" cmd /k "set NODE_ENV=development && npx tsx server/index.ts"

timeout /t 3 /nobreak >nul

echo [Step 6] Starting Frontend...
start "HarvestConnect Frontend" cmd /k "npx vite --port 5173"

echo.
echo ============================================
echo      SYSTEMS READY!
echo ============================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Test Accounts:
echo   Admin:   admin@harvesthub.co.ke / admin123
echo   User:    user@harvesthub.co.ke / user123
echo   Farmer:  farmer@harvesthub.co.ke / farmer123
echo.
timeout /t 2 >nul
start http://localhost:5173

pause
