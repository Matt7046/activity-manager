@echo off
call "%~dp0DEPLOY-SERVICE.BAT" auth-service
exit /b %errorlevel%
