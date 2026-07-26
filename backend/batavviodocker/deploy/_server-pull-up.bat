@echo off
rem Sul VPS: pull + up solo dei container del servizio (non tocca gli altri).
setlocal
call "%~dp0_load-config.bat"
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

set "SSH_TARGET=%DEPLOY_USER%@%DEPLOY_HOST%"
set "REMOTE_CMD=cd %DEPLOY_PATH% && docker compose -f %DEPLOY_COMPOSE_FILE% pull %REPLICAS% && docker compose -f %DEPLOY_COMPOSE_FILE% up -d %REPLICAS%"

echo.
echo === SERVER %SSH_TARGET% ===
echo Path: %DEPLOY_PATH%
echo Cmd:  %REMOTE_CMD%
echo.

if defined DEPLOY_SSH_KEY (
  ssh -i "%DEPLOY_SSH_KEY%" -o StrictHostKeyChecking=accept-new %SSH_TARGET% "%REMOTE_CMD%"
) else (
  ssh -o StrictHostKeyChecking=accept-new %SSH_TARGET% "%REMOTE_CMD%"
)
if errorlevel 1 (
  echo.
  echo [ERRORE] SSH/pull/up fallito.
  echo Verifica: DEPLOY_PATH in config.bat ^(es. /root/app/backend^), chiave SSH o password.
  exit /b 1
)

echo [OK] Server aggiornato: %REPLICAS%
exit /b 0
