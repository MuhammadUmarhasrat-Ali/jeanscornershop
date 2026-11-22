@echo off
title GENSCORNAR Luxury Store Server
echo Starting GENSCORNAR local preview server on port 5500...
echo.
echo Recommended URL: http://127.0.0.1:5500
echo Localhost URL:   http://localhost:5500
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    node server.js
) else (
    python -m http.server 5500 --bind 0.0.0.0
)
pause
