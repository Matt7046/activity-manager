@echo off
rem Carica config.bat se presente, altrimenti default.
if exist "%~dp0config.bat" (
  call "%~dp0config.bat"
) else (
  echo [WARN] Manca deploy\config.bat — uso default da config.bat.example
  if exist "%~dp0config.bat.example" call "%~dp0config.bat.example"
)

if "%DEPLOY_HOST%"=="" set "DEPLOY_HOST=173.212.220.20"
if "%DEPLOY_USER%"=="" set "DEPLOY_USER=root"
if "%DEPLOY_PATH%"=="" set "DEPLOY_PATH=/root/app/backend"
rem Stesso file della cartella prod (build/up). Sul server per solo-pull va bene uguale:
rem le image: Hub sono le stesse di docker-compose.yml.
if "%DEPLOY_COMPOSE_FILE%"=="" set "DEPLOY_COMPOSE_FILE=docker-compose.prod.yml"
if "%DEPLOY_GIT_MERGE%"=="" set "DEPLOY_GIT_MERGE=1"
if "%DEPLOY_GIT_PUSH%"=="" set "DEPLOY_GIT_PUSH=1"
if "%DEPLOY_USE_CACHE%"=="" set "DEPLOY_USE_CACHE=1"

rem Stesso path della cartella prod: da batavviodocker\deploy (o prod) -> ..\.. = backend
set "BACKEND_DIR=%~dp0..\.."
for %%I in ("%BACKEND_DIR%") do set "BACKEND_DIR=%%~fI"
set "COMPOSE_PROD=%BACKEND_DIR%\docker-compose.prod.yml"
set "REPO_ROOT=%BACKEND_DIR%\.."
for %%I in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fI"

if not exist "%BACKEND_DIR%\docker-compose.prod.yml" (
  echo [ERRORE] Non trovo docker-compose.prod.yml in:
  echo   %BACKEND_DIR%
  exit /b 1
)
