@echo off
setlocal
rem Avvio Next in locale su main: .env + local.env (override). Vedi frontend\scripts\load-frontend-env.cjs
set FRONTEND_USE_LOCAL_ENV=1
cd /d "%~dp0frontend"
call npm run dev
endlocal
