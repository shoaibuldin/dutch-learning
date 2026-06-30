@echo off
REM Set the private login for your Dutch app (username + password).
REM These are stored securely on Cloudflare, never shown to anyone else.
cd /d "%~dp0"
echo.
echo ============================================
echo   Set your private login for the Dutch app
echo ============================================
echo.
echo You'll be asked for a secret value TWICE.
echo   1) First, type a USERNAME  (e.g. your name)  then press Enter
echo.
call npx wrangler secret put AUTH_USER
echo.
echo   2) Now type a PASSWORD  then press Enter
echo.
call npx wrangler secret put AUTH_PASS
echo.
echo ============================================
echo   Done! Open your app and log in with those:
echo   https://dutch-learning.shoaibuldin.workers.dev
echo ============================================
echo.
pause
