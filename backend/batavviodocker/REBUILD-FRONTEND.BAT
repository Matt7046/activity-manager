@echo off
setlocal
call "%~dp0SERVICE_REBUILD.BAT" frontend
exit /b %errorlevel%
