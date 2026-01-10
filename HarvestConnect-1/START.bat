@echo off
chcp 65001 >nul
title HarvestConnect - Simple Start

cls
echo ========================================
echo    SIMPLE SERVER START
echo ========================================
echo.

cd /d "%~dp0"

echo Starting development server...
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5000

echo.
echo ========================================
echo        SERVER STARTED
echo ========================================
echo.
echo The server is now running!
echo.
echo Browser should open automatically...
echo.
echo.
echo If browser doesn't open:
echo   - Try opening: http://localhost:5000 manually
echo   - Check if any errors show in black window
echo.
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

timeout /t 999999 /nobreak >nul
