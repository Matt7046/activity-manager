#per compilare il front end
docker build -t frontend:1.0.0 .
docker rm -f frontend 
#per avviare due istanze
docker run -d --name frontend --network backend_app-network -p 3000:80 frontend:1.0.0 
docker run -d --name frontend --network backend_app-network -p 3001:80 frontend:1.0.0   
#per compilare il backend
docker-compose up --build 
