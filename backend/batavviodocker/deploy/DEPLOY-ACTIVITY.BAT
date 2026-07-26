@echo off
call "%~dp0DEPLOY-SERVICE.BAT" activity-service
exit /b %errorlevel%
