@echo off
chcp 65001 >nul
title HarvestConnect - Fix and Start

cls
echo ============================================
echo     FIX DATABASE AND START
echo ============================================
echo.

cd /d "%~dp0"

echo [Step 0] Forcing kill of ALL Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo [Step 1] Deleting old database...
del /F harvestconnect.db* 2>nul
timeout /t 1 /nobreak >nul

echo [Step 2] Creating new database schema...
npx drizzle-kit push
if errorlevel 1 (
    echo ERROR: Failed to create database schema
    pause
    exit /b 1
)

echo [Step 3] Seeding test users...
node test-db.mjs
if errorlevel 1 (
    echo WARNING: Seeding may have failed
)

echo [Step 4] Starting Backend Server...
start "HarvestConnect Backend" cmd /k "set NODE_ENV=development && npx tsx server/index.ts"

timeout /t 3 /nobreak >nul

echo [Step 5] Starting Frontend Server...
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
