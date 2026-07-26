@echo off
call "%~dp0DEPLOY-SERVICE.BAT" notification-service
exit /b %errorlevel%
