@echo off
setlocal

cd /d "%~dp0..\.."

set "COMPOSE_FILE=docker-compose.prod.yml"
set "BUILD_EXTRA=--pull --progress=plain --no-cache"
if /i "%PROD_REBUILD_USE_CACHE%"=="1" set "BUILD_EXTRA=--pull --progress=plain"

echo Stack prod: %COMPOSE_FILE%
echo Build servizi con sezione build: %BUILD_EXTRA%
echo.

call docker compose -f %COMPOSE_FILE% down

call docker compose -f %COMPOSE_FILE% build %BUILD_EXTRA%
if errorlevel 1 (
  echo Build fallita.
  pause
  exit /b 1
)

call docker compose -f %COMPOSE_FILE% up -d
if errorlevel 1 (
  echo Avvio fallito.
  pause
  exit /b 1
)

echo.
echo Completato.
pause
exit /b 0
