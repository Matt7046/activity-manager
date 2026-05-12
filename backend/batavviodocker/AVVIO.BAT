@echo off
setlocal

rem Torna alla directory principale
cd ..
cd ..

rem --- FRONTEND ---
cd frontend

rem Crea la rete solo se non esiste
docker network inspect app-network >nul 2>&1 || docker network create app-network

echo Build dell'immagine frontend...
docker build -t frontend:1.0.1 .

echo Pulizia profonda container sulla porta 3001...
rem Questo comando trova e killa qualsiasi container che stia occupando la porta 3001
for /f "tokens=*" %%i in ('docker ps -q --filter "publish=3001"') do (
    echo Trovato container %%i sulla porta 3001. Rimozione in corso...
    docker rm -f %%i
)

rem Per sicurezza, rimuoviamo anche se esiste un container di nome frontend0
docker rm -f frontend0 >nul 2>&1

echo Avvio container frontend sulla porta 3001...
docker run -d --name frontend0 --network app-network -p 3001:3000 frontend:1.0.1

rem --- BACKEND ---
cd ..
cd backend

echo Gestione Backend con Docker Compose (localhost + porte microservizi)...
call docker-compose -f docker-compose.localhost.yml -f docker-compose.microservice-ports.yml down

echo Avvio dei container con Docker Compose (localhost + porte microservizi)...
call docker-compose -f docker-compose.localhost.yml -f docker-compose.microservice-ports.yml up --build

echo Operazione completata!
pause