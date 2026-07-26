@echo off
rem Build solo immagine Hub (non avvia container locali).
setlocal
call "%~dp0_load-config.bat"
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1
cd /d "%BACKEND_DIR%"
if errorlevel 1 exit /b 1

if /i "%~1"=="frontend" set FRONTEND_USE_LOCAL_ENV=0

set "BUILD_EXTRA=--pull --progress=plain"
if /i not "%DEPLOY_USE_CACHE%"=="1" set "BUILD_EXTRA=%BUILD_EXTRA% --no-cache"

echo.
echo === BUILD %BUILD_SVC% -^> %HUB_IMAGE% ===
echo docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
call docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)
echo [OK] Build %HUB_IMAGE%
exit /b 0
