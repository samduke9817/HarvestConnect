@echo off
chcp 65001 >nul
title HarvestConnect - Launcher

cls
echo.
echo ========================================
echo     HARVEST CONNECT LAUNCHER
echo ========================================
echo.
echo Choose an option:
echo.
echo [1] Quick Start (Just Run Server)
echo [2] Database Setup (First Time)
echo [3] Full Setup (Dependencies + Database + Server)
echo [4] Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto quick
if "%choice%"=="2" goto database
if "%choice%"=="3" goto full
if "%choice%"=="4" goto end

:quick
cls
echo.
echo ========================================
echo        STARTING SERVER
echo ========================================
echo.
echo Opening browser to: http://localhost:5000
echo.
cd /d "%~dp0"

REM Set DATABASE_URL for SQLite
set DATABASE_URL=./harvest-connect.db

timeout /t 2 /nobreak >nul
start http://localhost:5000

npm run dev
if errorlevel 1 (
    echo.
    echo [ERROR] Server failed to start!
    echo.
    echo Common fixes:
    echo - Make sure Node.js is installed
    echo - Close other instances running on port 5000
    echo.
    pause
)
goto end

:database
cls
echo.
echo ========================================
echo      DATABASE SETUP
echo ========================================
echo.
cd /d "%~dp0"

REM Set DATABASE_URL for SQLite
set DATABASE_URL=./harvest-connect.db

echo [1/2] Pushing database schema...
call npm run db:push
if errorlevel 1 (
    echo.
    echo [ERROR] Database setup failed!
    echo.
    pause
    goto end
)
echo.
echo [DONE] Database schema created!
echo.
echo [2/2] Checking for seed data...
if exist "seed-sqlite.ts" (
    echo Seeding sample data...
    call npm run seed
    if errorlevel 1 (
        echo [WARNING] Seeding had issues, but database should work
    )
) else (
    echo [SKIP] No seed file found
)
echo.
echo ========================================
echo        DATABASE READY!
echo ========================================
echo.
echo Now you can:
echo 1. Run this launcher again and choose [1] Quick Start
echo 2. Or press any key to start server now...
pause >nul
goto quick

:full
cls
echo.
echo ========================================
echo        FULL SETUP
echo ========================================
echo.
cd /d "%~dp0"

REM Set DATABASE_URL for SQLite
set DATABASE_URL=./harvest-connect.db

echo [1/3] Installing dependencies...
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        pause
        goto end
    )
    echo [DONE] Dependencies installed!
) else (
    echo [SKIP] Dependencies already installed
)

echo.
echo [2/3] Setting up database...
call npm run db:push
if errorlevel 1 (
    echo.
    echo [ERROR] Database setup failed!
    echo.
    pause
    goto end
)
echo [DONE] Database ready!

echo.
echo [3/3] Seeding data...
if exist "seed-sqlite.ts" (
    call npm run seed
    if errorlevel 1 (
        echo [WARNING] Seeding had issues
    )
)

echo.
echo [4/3] Starting server...
timeout /t 2 /nobreak >nul
start http://localhost:5000
call npm run dev
if errorlevel 1 (
    echo.
    echo [ERROR] Server failed!
    echo.
    pause
)
goto end

:end
echo.
echo Goodbye!
timeout /t 2 >nul
exit