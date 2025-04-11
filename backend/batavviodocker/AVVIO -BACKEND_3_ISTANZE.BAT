@echo off


rem Torna alla directory principale e esegui mvn clean install
cd..
cd..

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


