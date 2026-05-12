@echo off
setlocal

echo.
echo Push immagini Docker Hub — frontend + tutti i microservizi
echo.

call :pushImage "docker.io/matt7046/frontend:1.0.1"
call :pushImage "docker.io/matt7046/user-point-service:1.0.0"
call :pushImage "docker.io/matt7046/activity-service:1.0.0"
call :pushImage "docker.io/matt7046/auth-service:1.0.0"
call :pushImage "docker.io/matt7046/family-service:1.0.0"
call :pushImage "docker.io/matt7046/notification-service:1.0.0"
call :pushImage "docker.io/matt7046/image-service:1.0.0"

echo.
echo Push completato con successo.
pause
exit /b 0

:pushImage
set IMAGE=%~1
echo [PUSH] %IMAGE%
docker push %IMAGE%
if errorlevel 1 (
  echo.
  echo Errore durante il push di %IMAGE%
  pause
  exit /b 1
)
echo [OK] %IMAGE%
echo.
exit /b 0
