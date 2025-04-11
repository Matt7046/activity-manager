@echo off


rem Torna alla directory principale e esegui mvn clean install
cd..
cd..

cd backend
@echo off

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
call docker-compose up --build


pause


