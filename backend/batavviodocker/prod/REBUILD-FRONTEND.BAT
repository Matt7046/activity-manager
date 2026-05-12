@echo off
setlocal
call "%~dp0PROD_SERVICE_REBUILD.BAT" frontend
exit /b %errorlevel%
