@echo off
chcp 65001 >nul
title HarvestConnect - Reset and Seed Database

echo.
echo ============================================
echo     RESET AND SEED DATABASE
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Checking database file...
if exist "harvest-connect.db" (
    echo Deleting existing database...
    del "harvest-connect.db"
    echo [DONE] Database deleted!
) else (
    echo [SKIP] No existing database found
)
echo.

echo [2/3] Pushing new database schema...
call npm run db:push:sqlite
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
call npm run seed:pg
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
echo You can now run START-SERVER.bat to start the development server.
echo.
pause