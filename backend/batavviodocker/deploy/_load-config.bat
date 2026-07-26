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
if "%DEPLOY_COMPOSE_FILE%"=="" set "DEPLOY_COMPOSE_FILE=docker-compose.yml"
if "%DEPLOY_GIT_MERGE%"=="" set "DEPLOY_GIT_MERGE=1"
if "%DEPLOY_GIT_PUSH%"=="" set "DEPLOY_GIT_PUSH=1"
if "%DEPLOY_USE_CACHE%"=="" set "DEPLOY_USE_CACHE=1"

set "REPO_ROOT=%~dp0..\..\.."
for %%I in ("%REPO_ROOT%") do set "REPO_ROOT=%%~fI"
set "BACKEND_DIR=%REPO_ROOT%\backend"
set "COMPOSE_PROD=%BACKEND_DIR%\docker-compose.prod.yml"
