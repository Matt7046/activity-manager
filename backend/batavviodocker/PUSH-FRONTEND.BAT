@echo off
setlocal
call "%~dp0PUSH-ONE.BAT" "docker.io/matt7046/frontend:1.0.1"
exit /b %errorlevel%
