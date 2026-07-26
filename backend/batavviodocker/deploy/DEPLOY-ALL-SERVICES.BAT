@echo off
rem Deploy di tutti i microservizi (NO frontend). Merge git una sola volta.
setlocal
call "%~dp0_load-config.bat"

if /i not "%DEPLOY_SKIP_GIT%"=="1" (
  call "%~dp0_git-merge-production.bat"
  if errorlevel 1 exit /b 1
)

set "DEPLOY_SKIP_GIT=1"

call "%~dp0DEPLOY-SERVICE.BAT" activity-service
if errorlevel 1 exit /b 1
call "%~dp0DEPLOY-SERVICE.BAT" auth-service
if errorlevel 1 exit /b 1
call "%~dp0DEPLOY-SERVICE.BAT" notification-service
if errorlevel 1 exit /b 1
call "%~dp0DEPLOY-SERVICE.BAT" image-service
if errorlevel 1 exit /b 1
call "%~dp0DEPLOY-SERVICE.BAT" user-point-service
if errorlevel 1 exit /b 1

echo [DONE] Tutti i microservizi.
exit /b 0
