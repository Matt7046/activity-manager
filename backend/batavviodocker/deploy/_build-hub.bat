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

rem Blocca build frontend senza SERVICE_URL bake-in (rompe la home: axios baseURL vuoto).
rem Next.js legge solo frontend/.env a build-time (FRONTEND_USE_LOCAL_ENV=0); backend/.env non basta.
if /i "%~1"=="frontend" (
  set "FE_ENV=%BACKEND_DIR%\..\frontend\.env"
  set "BE_ENV=%BACKEND_DIR%\.env"
  set "FE_URL_OK="
  if exist "%FE_ENV%" (
    findstr /B /C:"NEXT_PUBLIC_SERVICE_URL=http" "%FE_ENV%" >nul
    if not errorlevel 1 set "FE_URL_OK=1"
    findstr /B /C:"SERVICE_URL=http" "%FE_ENV%" >nul
    if not errorlevel 1 set "FE_URL_OK=1"
  )
  if not defined FE_URL_OK (
    set "BE_HAS_URL="
    if exist "%BE_ENV%" (
      findstr /B /C:"NEXT_PUBLIC_SERVICE_URL=http" "%BE_ENV%" >nul
      if not errorlevel 1 set "BE_HAS_URL=1"
      findstr /B /C:"SERVICE_URL=http" "%BE_ENV%" >nul
      if not errorlevel 1 set "BE_HAS_URL=1"
    )
    echo [ERRORE] Critico: NEXT_PUBLIC_SERVICE_URL / SERVICE_URL mancante o vuoto in frontend\.env
    if defined BE_HAS_URL (
      echo Trovato in backend\.env ma Next bakea da frontend\.env — copia NEXT_PUBLIC_SERVICE_URL li'.
    ) else (
      echo Non trovato neanche in backend\.env. Copia da server /root/app/frontend/.env
    )
    echo Atteso es. NEXT_PUBLIC_SERVICE_URL=https://activity-manager.colorsdev.tech/api
    echo NON committare .env.
    exit /b 1
  )
)

echo docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
call docker compose -f docker-compose.prod.yml build %BUILD_EXTRA% %BUILD_SVC%
if errorlevel 1 (
  echo Build fallita.
  exit /b 1
)
echo [OK] Build %HUB_IMAGE%
exit /b 0
