@echo off
REM One-click deploy for the Dutch A2 app (cross-device sync + private login).
REM First time only: open a terminal here and run  npx wrangler login
cd /d "%~dp0"
node deploy.mjs
echo.
pause
