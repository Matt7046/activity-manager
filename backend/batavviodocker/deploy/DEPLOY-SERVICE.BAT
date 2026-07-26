@echo off
rem =============================================================================
rem DEPLOY di un servizio Activity Manager (flusso produzione)
rem   1) merge main -> production (+ push)
rem   2) docker build da backend\ con docker-compose.prod.yml (come cartella prod)
rem   3) docker push Hub
rem   4) sul VPS: compose pull + up SOLO quel servizio (stesso compose prod)
rem
rem Uso: DEPLOY-SERVICE.BAT frontend
rem      DEPLOY-SERVICE.BAT activity-service
rem Opzioni: set DEPLOY_SKIP_GIT=1 / DEPLOY_SKIP_BUILD=1 / DEPLOY_SKIP_PUSH=1 / DEPLOY_SKIP_SERVER=1
rem =============================================================================
setlocal
if "%~1"=="" (
  echo Uso: %~nx0 nome-servizio
  echo Servizi: frontend activity-service auth-service notification-service image-service user-point-service
  exit /b 1
)

call "%~dp0_load-config.bat"
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

echo.
echo ############################################
echo # DEPLOY %~1
echo # Image: %HUB_IMAGE%
echo ############################################

if /i not "%DEPLOY_SKIP_GIT%"=="1" (
  call "%~dp0_git-merge-production.bat"
  if errorlevel 1 exit /b 1
) else (
  echo [SKIP] git merge
)

if /i not "%DEPLOY_SKIP_BUILD%"=="1" (
  call "%~dp0_build-hub.bat" "%~1"
  if errorlevel 1 exit /b 1
) else (
  echo [SKIP] build
)

if /i not "%DEPLOY_SKIP_PUSH%"=="1" (
  call "%~dp0_push-hub.bat" "%~1"
  if errorlevel 1 exit /b 1
) else (
  echo [SKIP] push
)

if /i not "%DEPLOY_SKIP_SERVER%"=="1" (
  call "%~dp0_server-pull-up.bat" "%~1"
  if errorlevel 1 exit /b 1
) else (
  echo [SKIP] server
)

echo.
echo [DONE] Deploy %~1 completato.
exit /b 0
