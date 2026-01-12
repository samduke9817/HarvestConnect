@echo off
chcp 65001 >nul
title HarvestConnect - Standalone Server

cls
echo ========================================
echo     STANDALONE SERVER START
echo ========================================
echo.

cd /d "%~dp0\server"

echo Starting standalone Express server...
echo This bypasses vite config issues.
echo.

timeout /t 2 /nobreak >nul
node standalone-server.js

echo.
echo ========================================
echo        SERVER STARTED
echo ========================================
echo.
echo The server is now running!
echo Browser should open automatically...
echo.
echo If browser doesn't open:
echo   - Try opening: http://localhost:5000 manually
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

timeout /t 999999 /nobreak >nul
