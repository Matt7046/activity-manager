@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" activity-service
exit /b %errorlevel%
