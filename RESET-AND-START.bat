@echo off
chcp 65001 >nul
title HarvestConnect - Fix Database

cls
echo ============================================
echo     FIX DATABASE AND START
echo ============================================
echo.

cd /d "%~dp0"

echo [Cleanup] Stopping all servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 1 /nobreak >nul

echo [Step 1] Deleting old database...
taskkill //F //IM node.exe 2>nul
timeout /t 2 /nobreak >nul
del /F harvestconnect.db* 2>nul

echo [Step 2] Creating new database with correct schema...
npx drizzle-kit push

echo [Step 3] Seeding test users...
node test-db.mjs

echo [Step 4] Starting Backend Server...
start "HarvestConnect Backend" cmd /k "set NODE_ENV=development && npx tsx server/index.ts"

echo [Step 5] Starting Frontend Server...
timeout /t 3 /nobreak >nul
start "HarvestConnect Frontend" cmd /k "npx vite --port 5173"

echo.
echo ============================================
echo      ALL SYSTEMS READY!
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
