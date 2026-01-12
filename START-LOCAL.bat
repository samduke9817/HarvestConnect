@echo off
chcp 65001 >nul
title HarvestConnect - Local Development

cls
echo ============================================
echo    HARVEST CONNECT LOCAL START
echo ============================================
echo.

echo Step 1: Starting Backend Server...
echo.
start /B cmd /C "cd /d "%~dp0" && npx tsx server/index.ts"

echo Step 2: Waiting for backend to start...
echo.
timeout /t 3 /nobreak >nul

echo Step 3: Starting Frontend...
echo.
start cmd /C "cd /d "%~dp0" && npx vite --port 5173"

echo.
echo ============================================
echo    SERVERS STARTING...
echo ============================================
echo.
echo Backend: http://localhost:3000/api/*
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop servers
echo ============================================
echo.

timeout /t 9999 /nobreak >nul