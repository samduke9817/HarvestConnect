@echo off
chcp 65001 >nul
title HarvestConnect - Reset and Seed Database

cls

echo.
echo ============================================
echo     RESET AND SEED DATABASE
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Checking database file...
if exist "harvestconnect.db" (
    echo Deleting existing database...
    del "harvestconnect.db"
    echo [DONE] Database deleted!
) else (
    echo [SKIP] No existing database found
)
echo.

echo [2/3] Pushing new database schema...
npx drizzle-kit push
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to create database schema!
    echo.
    pause
    exit /b 1
)
echo [DONE] Database schema created!
echo.

echo [3/3] Seeding with sample data...
node test-db.mjs
if errorlevel 1 (
    echo.
    echo [WARNING] Seeding may have failed, but database should still work
    echo.
) else (
    echo [DONE] Database seeded with sample data!
    echo.
)

echo.
echo ============================================
echo           DATABASE READY!
echo ============================================
echo.
echo You can now run the server to start the application.
echo.
pause
