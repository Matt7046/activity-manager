@echo off
setlocal
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1

if "%~1"=="" (
  echo Uso: PROD_SERVICE_REBUILD.BAT nome-logico
  echo Esempi: user-point-service   activity-service   frontend
  echo Ricrea entrambe le repliche *-1 e *-2 dopo build su *-1.
  echo Opzionale: set PROD_REBUILD_USE_CACHE=1 per build piu^ veloce ^(layer Docker + cache Maven .m2^).
  exit /b 1
)

set "LOG=%~1"
set "BUILD="
set "REPLICAS="

if /i "%LOG%"=="user-point-service" set BUILD=user-point-service-1& set REPLICAS=user-point-service-1 user-point-service-2& goto :run
if /i "%LOG%"=="activity-service" set BUILD=activity-service-1& set REPLICAS=activity-service-1 activity-service-2& goto :run
if /i "%LOG%"=="auth-service" set BUILD=auth-service-1& set REPLICAS=auth-service-1 auth-service-2& goto :run
if /i "%LOG%"=="notification-service" set BUILD=notification-service-1& set REPLICAS=notification-service-1 notification-service-2& goto :run
if /i "%LOG%"=="image-service" set BUILD=image-service-1& set REPLICAS=image-service-1 image-service-2& goto :run
if /i "%LOG%"=="frontend" set BUILD=frontend-1& set REPLICAS=frontend-1 frontend-2& goto :run

echo Servizio non riconosciuto: %LOG%
exit /b 1

:run
cd /d "%~dp0..\.."
set "COMPOSE_FILE=docker-compose.prod.yml"
rem Build frontend: solo .env in immagine (local.env escluso da .dockerignore)
if /i "%LOG%"=="frontend" set FRONTEND_USE_LOCAL_ENV=0

rem Build “vera”: niente solo cache Docker (Maven altrimenti sembra istantaneo).
rem --no-cache = ricompila gli stage; --pull = aggiorna le immagini base; --progress=plain = log in console.
rem Build veloce con cache: imposta PROD_REBUILD_USE_CACHE=1 prima di lanciare lo script.
set "BUILD_EXTRA=--pull --progress=plain --no-cache"
if /i "%PROD_REBUILD_USE_CACHE%"=="1" set "BUILD_EXTRA=--pull --progress=plain"

echo.
echo [1/3] Build %BUILD% ^(%COMPOSE_FILE%^) %BUILD_EXTRA% ...
call docker compose -f %COMPOSE_FILE% build %BUILD_EXTRA% %BUILD%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)
echo [OK] Immagine %BUILD% aggiornata.

echo.
echo [2/3] Stop e rimozione: %REPLICAS%
call docker compose -f %COMPOSE_FILE% rm -f -s %REPLICAS%

echo.
echo [3/3] Avvio: %REPLICAS%
call docker compose -f %COMPOSE_FILE% up -d %REPLICAS%
if errorlevel 1 (
  echo Avvio fallito.
  exit /b 1
)

echo.
echo Completato per %LOG%.
exit /b 0
