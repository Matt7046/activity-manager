@echo off


rem Torna alla directory principale e esegui mvn clean install
cd..
cd..

cd frontend

docker network create backend_app-network || true
echo Build dell'immagine...
docker build -t frontend:1.0.0 .

echo Rimozione del container esistente (se presente)...
docker rm -f frontend

echo Avvio container frontend sulla porta 3000...
docker run -d --name frontend --network backend_app-network -p 3000:80 frontend:1.0.0

echo Avvio container frontend sulla porta 3001 (secondo container)...
docker run -d --name frontend2 --network backend_app-network -p 3001:80 frontend:1.0.0


@echo off
echo Avvio dei container con Docker Compose...
cd ..
cd backend
call docker-compose up --build


pause


