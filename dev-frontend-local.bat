@echo off
setlocal
rem Avvio Next in locale: carica .env poi local.env (override) — come backend\docker-compose.localhost.yml
cd /d "%~dp0frontend"
call npm run dev
endlocal
