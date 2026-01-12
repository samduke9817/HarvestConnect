@echo off
chcp 65001 >nul
title HarvestConnect - Start Development Server

cls

echo.
echo ============================================
echo     STARTING DEVELOPMENT SERVER
echo ============================================
echo.

cd /d "%~dp0"

echo [Cleanup] Stopping any existing servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 1 /nobreak >nul
echo [DONE] Cleanup complete
echo.

echo [Step 1] Starting Backend Server (port 3000)...
start "HarvestConnect Backend" cmd /k "set NODE_ENV=development && npx tsx server/index.ts"

echo [Step 2] Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo [Step 3] Starting Frontend Server (Vite on port 5173)...
start "HarvestConnect Frontend" cmd /k "npx vite --port 5173"

echo.
echo ============================================
echo      SERVERS STARTED SUCCESSFULLY!
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
echo Application is now running!
echo.

timeout /t 2 >nul
start http://localhost:5173

echo.
echo Press any key to close this window (servers will continue running)...
pause
