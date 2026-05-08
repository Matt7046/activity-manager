@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" user-point-service
exit /b %errorlevel%
