@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" user-point-service
exit /b %errorlevel%
