@echo off
setlocal

if "%~1"=="" (
  echo Uso: SERVICE_REBUILD.BAT nome-logico-servizio
  echo Esempio: SERVICE_REBUILD.BAT user-point-service
  echo Usa docker-compose.prod.yml ^(repliche -1/-2, nessun overlay porte^).
  echo Default: build senza cache Docker ^(--no-cache^). Per piu^ velocita^: set PROD_REBUILD_USE_CACHE=1
  exit /b 1
)

call "%~dp0PROD_SERVICE_REBUILD.BAT" %~1
exit /b %errorlevel%
