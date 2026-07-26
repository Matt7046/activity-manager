@echo off
call "%~dp0DEPLOY-SERVICE.BAT" user-point-service
exit /b %errorlevel%
