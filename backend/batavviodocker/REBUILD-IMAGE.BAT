@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" image-service
exit /b %errorlevel%
