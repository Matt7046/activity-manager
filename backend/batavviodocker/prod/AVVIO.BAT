@echo off
setlocal

cd /d "%~dp0..\.."

echo Stack prod ^(docker-compose.prod.yml^) — senza docker-compose.microservice-ports.yml
echo Avvio completo: down poi up --build -d
echo.

call docker compose -f docker-compose.prod.yml down

call docker compose -f docker-compose.prod.yml up --build -d
if errorlevel 1 (
  echo Avvio fallito.
  pause
  exit /b 1
)

echo.
echo Operazione completata.
pause
exit /b 0
