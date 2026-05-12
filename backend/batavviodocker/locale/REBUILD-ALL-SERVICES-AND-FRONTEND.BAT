@echo off
setlocal

echo ==================================================
echo Rebuild microservizi + frontend (locale / localhost)
echo ==================================================

call "%~dp0REBUILD-ALL-SERVICE.BAT"
if errorlevel 1 goto :fail

call "%~dp0REBUILD-FRONTEND.BAT"
if errorlevel 1 goto :fail

echo.
echo ==================================================
echo Rebuild completato con successo (incluso frontend).
echo ==================================================
exit /b 0

:fail
echo.
echo ==================================================
echo Rebuild interrotto per errore.
echo ==================================================
exit /b 1
