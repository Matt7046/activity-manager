@echo off
rem Push su Docker Hub senza pause interattivo.
setlocal
call "%~dp0_load-config.bat"
call "%~dp0_resolve-service.bat" "%~1"
if errorlevel 1 exit /b 1

echo.
echo === PUSH %HUB_IMAGE% ===
docker push %HUB_IMAGE%
if errorlevel 1 (
  echo Push fallito. Sei loggato? docker login
  exit /b 1
)
echo [OK] Push %HUB_IMAGE%
exit /b 0
