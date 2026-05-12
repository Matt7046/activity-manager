@echo off
setlocal

if "%~1"=="" (
  echo Uso: SERVICE_REBUILD.BAT nome-logico-servizio
  echo Esempio: SERVICE_REBUILD.BAT family-service
  echo Usa docker-compose.prod.yml ^(repliche -1/-2, nessun overlay porte^).
  exit /b 1
)

call "%~dp0PROD_SERVICE_REBUILD.BAT" %~1
exit /b %errorlevel%
