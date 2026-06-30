@echo off
setlocal enabledelayedexpansion
title Dutch A2 Reading Sprint - Local Server
cd /d "%~dp0"

echo ============================================
echo   Dutch A2 - Reading Sprint
echo   Starting a local server so your phone
echo   can open the app over your home WiFi.
echo ============================================
echo.
echo Open ONE of these addresses on your phone's browser
echo (phone must be on the SAME WiFi as this PC):
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "ip=%%a"
  set "ip=!ip: =!"
  echo     http://!ip!:8000
)
echo.
echo On this PC you can also open:  http://localhost:8000
echo.
echo Keep this window OPEN while you study. Close it to stop the server.
echo ============================================
echo.

where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8000
  goto :done
)
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8000
  goto :done
)

echo Python was not found on this PC.
echo Easiest fix: install Python from https://www.python.org/downloads/
echo (tick "Add Python to PATH" during install), then run this file again.
echo.
echo No Python? You can still use the app on THIS PC by double-clicking index.html.
echo To use it on the phone without Python, email index.html to yourself and open it on the phone.
pause

:done
endlocal
