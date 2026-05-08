@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" notification-service
exit /b %errorlevel%
