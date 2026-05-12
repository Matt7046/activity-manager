@echo off
setlocal

echo ==================================================
echo Rebuild tutti i microservizi — SENZA frontend
echo (prod: docker-compose.prod.yml)
echo ==================================================

call "%~dp0REBUILD-USERPOINT.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-ACTIVITY.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-AUTH.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-FAMILY.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-NOTIFICATION.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-IMAGE.BAT"
if errorlevel 1 goto :fail

echo.
echo ==================================================
echo Rebuild microservizi completato (frontend non incluso).
echo Per includere il frontend: REBUILD-ALL-SERVICES-AND-FRONTEND.BAT
echo ==================================================
exit /b 0

:fail
echo.
echo ==================================================
echo Rebuild interrotto per errore.
echo ==================================================
exit /b 1
