@echo off
rem Microservizi + frontend (merge git una sola volta all'inizio).
setlocal
call "%~dp0_load-config.bat"

if /i not "%DEPLOY_SKIP_GIT%"=="1" (
  call "%~dp0_git-merge-production.bat"
  if errorlevel 1 exit /b 1
)
set "DEPLOY_SKIP_GIT=1"

call "%~dp0DEPLOY-ALL-SERVICES.BAT"
if errorlevel 1 exit /b 1
call "%~dp0DEPLOY-FRONTEND.BAT"
exit /b %errorlevel%
