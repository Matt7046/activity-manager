@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" notification-service
exit /b %errorlevel%
