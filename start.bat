@echo off
chcp 65001 > nul
title ComfyUI Image Manager
cd /d "%~dp0"

echo.
echo ========================================================================
echo              ComfyUI Image Manager
echo.
echo  Starting server...
echo ========================================================================
echo.

node.exe app\bundle.js

if errorlevel 1 (
    echo.
    echo ========================================================================
    echo  ERROR: Server failed to start
    echo.
    echo  Please check:
    echo  - Port 1566 is not in use
    echo  - All files are present
    echo  - Check logs folder for errors
    echo ========================================================================
    echo.
    pause
    exit /b 1
)

pause
