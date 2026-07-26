@echo off
call "%~dp0DEPLOY-SERVICE.BAT" frontend
exit /b %errorlevel%
