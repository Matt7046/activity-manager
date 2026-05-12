@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" activity-service
exit /b %errorlevel%
