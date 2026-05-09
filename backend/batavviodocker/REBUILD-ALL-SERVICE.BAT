@echo off
setlocal

echo ==================================================
echo Rebuild completo microservizi backend
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
echo Rebuild completato con successo.
echo ==================================================
exit /b 0

:fail
echo.
echo ==================================================
echo Rebuild interrotto per errore.
echo ==================================================
exit /b 1
