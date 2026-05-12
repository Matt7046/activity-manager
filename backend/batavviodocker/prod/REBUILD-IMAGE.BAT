@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" image-service
exit /b %errorlevel%
