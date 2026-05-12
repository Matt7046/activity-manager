@echo off
setlocal

if "%~1"=="" (
  echo Uso: PROD_SERVICE_REBUILD.BAT nome-logico
  echo Esempi: family-service   activity-service   frontend
  echo Ricrea entrambe le repliche *-1 e *-2 dopo build su *-1.
  exit /b 1
)

set "LOG=%~1"
set "BUILD="
set "REPLICAS="

if /i "%LOG%"=="user-point-service" set BUILD=user-point-service-1& set REPLICAS=user-point-service-1 user-point-service-2& goto :run
if /i "%LOG%"=="activity-service" set BUILD=activity-service-1& set REPLICAS=activity-service-1 activity-service-2& goto :run
if /i "%LOG%"=="auth-service" set BUILD=auth-service-1& set REPLICAS=auth-service-1 auth-service-2& goto :run
if /i "%LOG%"=="family-service" set BUILD=family-service-1& set REPLICAS=family-service-1 family-service-2& goto :run
if /i "%LOG%"=="notification-service" set BUILD=notification-service-1& set REPLICAS=notification-service-1 notification-service-2& goto :run
if /i "%LOG%"=="image-service" set BUILD=image-service-1& set REPLICAS=image-service-1 image-service-2& goto :run
if /i "%LOG%"=="frontend" set BUILD=frontend-1& set REPLICAS=frontend-1 frontend-2& goto :run

echo Servizio non riconosciuto: %LOG%
exit /b 1

:run
cd /d "%~dp0..\.."
set "COMPOSE_FILE=docker-compose.prod.yml"

echo.
echo [1/3] Build %BUILD% ^(%COMPOSE_FILE%, senza file porte extra^)...
call docker compose -f %COMPOSE_FILE% build %BUILD%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)

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
