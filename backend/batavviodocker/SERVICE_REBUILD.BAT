@echo off
setlocal

if "%~1"=="" (
  echo Uso: SERVICE_REBUILD.BAT nome-servizio
  echo Esempio: SERVICE_REBUILD.BAT activity-service
  exit /b 1
)

set SERVICE_NAME=%~1
set COMPOSE_FILE=docker-compose.localhost.yml

cd /d "%~dp0.."

echo.
echo [1/3] Build immagine per %SERVICE_NAME%...
call docker compose -f %COMPOSE_FILE% build %SERVICE_NAME%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)

echo.
echo [2/3] Stop e rimozione container %SERVICE_NAME%...
call docker compose -f %COMPOSE_FILE% rm -f -s %SERVICE_NAME%

echo.
echo [3/3] Avvio %SERVICE_NAME% con dipendenze...
call docker compose -f %COMPOSE_FILE% up -d %SERVICE_NAME%
if errorlevel 1 (
  echo Avvio fallito.
  exit /b 1
)

echo.
echo Operazione completata per %SERVICE_NAME%.
exit /b 0
