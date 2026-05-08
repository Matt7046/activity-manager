@echo off
setlocal
call "%~dp0PUSH-ONE.BAT" "docker.io/matt7046/auth-service:1.0.0"
exit /b %errorlevel%
