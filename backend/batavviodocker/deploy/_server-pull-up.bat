@echo off
rem Sul VPS: pull + up solo dei container del servizio.
rem IMPORTANTE: non usare "&&" nella stringa passata a ssh.exe da cmd.exe —
rem altrimenti cmd spezza il comando e docker compose gira in LOCALE (cartella deploy).
setlocal
call "%~dp0_load-config.bat"
if errorlevel 1 exit /b 1
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

set "SSH_TARGET=%DEPLOY_USER%@%DEPLOY_HOST%"
rem Usa ; (non &&) cosi' tutto resta un unico argomento remoto per ssh.
rem --force-recreate: senza questo, se i container sono gia' Running restano sulla vecchia immagine
rem anche dopo un pull riuscito.
set "REMOTE_CMD=cd %DEPLOY_PATH% ; docker compose -f %DEPLOY_COMPOSE_FILE% pull %REPLICAS% ; docker compose -f %DEPLOY_COMPOSE_FILE% up -d --force-recreate --remove-orphans=false %REPLICAS%"

echo.
echo === SERVER %SSH_TARGET% ===
echo Path: %DEPLOY_PATH%
echo Compose: %DEPLOY_COMPOSE_FILE%
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
echo Verifica DEPLOY_PATH / DEPLOY_COMPOSE_FILE in config.bat e accesso SSH.
echo Sul VPS deve esistere: %DEPLOY_PATH%\%DEPLOY_COMPOSE_FILE%
echo ^(di solito docker-compose.yml, NON docker-compose.prod.yml^)
exit /b 1
)

echo [OK] Server aggiornato: %REPLICAS%
exit /b 0
