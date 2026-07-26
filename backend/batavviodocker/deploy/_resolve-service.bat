@echo off
rem Imposta BUILD_SVC, REPLICAS, HUB_IMAGE in base al nome logico %1
set "BUILD_SVC="
set "REPLICAS="
set "HUB_IMAGE="

if /i "%~1"=="frontend" (
  set "BUILD_SVC=frontend-1"
  set "REPLICAS=frontend-1 frontend-2"
  set "HUB_IMAGE=docker.io/matt7046/frontend:1.0.1"
  goto :eof
)
if /i "%~1"=="activity-service" (
  set "BUILD_SVC=activity-service-1"
  set "REPLICAS=activity-service-1 activity-service-2"
  set "HUB_IMAGE=docker.io/matt7046/activity-service:1.0.0"
  goto :eof
)
if /i "%~1"=="auth-service" (
  set "BUILD_SVC=auth-service-1"
  set "REPLICAS=auth-service-1 auth-service-2"
  set "HUB_IMAGE=docker.io/matt7046/auth-service:1.0.0"
  goto :eof
)
if /i "%~1"=="notification-service" (
  set "BUILD_SVC=notification-service-1"
  set "REPLICAS=notification-service-1 notification-service-2"
  set "HUB_IMAGE=docker.io/matt7046/notification-service:1.0.0"
  goto :eof
)
if /i "%~1"=="image-service" (
  set "BUILD_SVC=image-service-1"
  set "REPLICAS=image-service-1 image-service-2"
  set "HUB_IMAGE=docker.io/matt7046/image-service:1.0.0"
  goto :eof
)
if /i "%~1"=="user-point-service" (
  set "BUILD_SVC=user-point-service-1"
  set "REPLICAS=user-point-service-1 user-point-service-2"
  set "HUB_IMAGE=docker.io/matt7046/user-point-service:1.0.0"
  goto :eof
)

echo Servizio non riconosciuto: %~1
echo Usa: frontend ^| activity-service ^| auth-service ^| notification-service ^| image-service ^| user-point-service
exit /b 1
