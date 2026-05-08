@echo off
setlocal

if "%~1"=="" (
  echo Uso: PUSH-ONE.BAT docker.io/matt7046/nome-immagine:tag
  exit /b 1
)

set IMAGE=%~1
echo [PUSH] %IMAGE%
docker push %IMAGE%
if errorlevel 1 (
  echo Errore durante il push di %IMAGE%
  pause
  exit /b 1
)
echo [OK] %IMAGE%
pause
exit /b 0
