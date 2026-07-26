@echo off
rem Build come prod\PROD_SERVICE_REBUILD: da backend\ con docker-compose.prod.yml
rem (solo build, senza avviare i container sulla macchina di build).
setlocal
call "%~dp0_load-config.bat"
if errorlevel 1 exit /b 1
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1
cd /d "%BACKEND_DIR%"
if errorlevel 1 (
  echo [ERRORE] cd fallito: %BACKEND_DIR%
  exit /b 1
)

if /i "%~1"=="frontend" set FRONTEND_USE_LOCAL_ENV=0

rem Allineato a prod: --no-cache di default; DEPLOY_USE_CACHE=1 per build veloce
set "BUILD_EXTRA=--pull --progress=plain --no-cache"
if /i "%DEPLOY_USE_CACHE%"=="1" set "BUILD_EXTRA=--pull --progress=plain"
if /i "%PROD_REBUILD_USE_CACHE%"=="1" set "BUILD_EXTRA=--pull --progress=plain"

echo.
echo === BUILD %BUILD_SVC% ^(come prod^) ===
echo CWD: %CD%
echo File: docker-compose.prod.yml
echo docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
call docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)
echo [OK] Build %HUB_IMAGE%
exit /b 0
