@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" family-service
exit /b %errorlevel%
