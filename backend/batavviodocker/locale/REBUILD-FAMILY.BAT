@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" family-service
exit /b %errorlevel%
