@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" auth-service
exit /b %errorlevel%
