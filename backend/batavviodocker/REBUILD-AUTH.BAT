@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" auth-service
exit /b %errorlevel%
