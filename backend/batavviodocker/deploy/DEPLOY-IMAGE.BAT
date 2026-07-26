@echo off
call "%~dp0DEPLOY-SERVICE.BAT" image-service
exit /b %errorlevel%
