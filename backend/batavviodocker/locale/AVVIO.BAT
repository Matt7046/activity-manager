@echo off
setlocal
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1

rem Radice repo (…\activity-manager): da locale\ sali di 3 livelli
cd /d "%~dp0..\..\.."

rem --- FRONTEND (dev su porta 3001) ---
cd frontend

docker network inspect app-network >nul 2>&1 || docker network create app-network

echo Build immagine frontend...
docker build -t frontend:1.0.1 .

echo Pulizia container sulla porta 3001...
for /f "tokens=*" %%i in ('docker ps -q --filter "publish=3001"') do (
    echo Rimozione container %%i sulla porta 3001...
    docker rm -f %%i
)

docker rm -f frontend0 >nul 2>&1

echo Avvio frontend0 su porta 3001...
docker run -d --name frontend0 --network app-network -p 3001:3000 frontend:1.0.1

rem --- BACKEND (localhost + porte microservizi) ---
cd ..\backend

echo Backend: docker-compose.localhost.yml + docker-compose.microservice-ports.yml
call docker compose -f docker-compose.localhost.yml -f docker-compose.microservice-ports.yml down

call docker compose -f docker-compose.localhost.yml -f docker-compose.microservice-ports.yml up --build

echo Operazione completata!
pause
