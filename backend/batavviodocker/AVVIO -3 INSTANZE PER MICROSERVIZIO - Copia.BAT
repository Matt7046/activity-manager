@echo off


rem Torna alla directory principale e esegui mvn clean install
cd..
cd..

cd frontend

docker network create app-network
echo Build dell'immagine...
docker build -t frontend:1.0.0 .


REM Fermare e rimuovere un container se esiste (frontend)
FOR /F %%i IN ('docker ps -aq -f "name=^frontend$"') DO docker rm -f %%i

echo Avvio container frontend sulla porta 3000...
docker run -d --name frontend --network app-network -p 3000:80 frontend:1.0.0

REM Fermare e rimuovere un container se esiste (frontend1)
FOR /F %%i IN ('docker ps -aq -f "name=^frontend1$"') DO docker rm -f %%i

echo Avvio container frontend1 sulla porta 3001...
docker run -d --name frontend1 --network app-network -p 3001:80 frontend:1.0.0

@echo off

cd ..
cd backend

setlocal
set container_id=backend
IF DEFINED container_id (
    echo Fermando e rimuovendo il container: "backend"
    docker-compose down
    echo container chiamato "backend" eliminato.

) ELSE (
    echo Nessun container chiamato "backend" trovato.
)
endlocal

echo Avvio dei container con Docker Compose...
call docker-compose up --scale activity-service=3 --scale register-service=3 --scale about-service=3 --scale points-service=3 --scale log-activity-service=3 --scale auth-service=3 --scale family-service=3 --scale notification-service=3


pause


