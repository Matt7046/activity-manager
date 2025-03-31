docker build -t frontend:1.0.0 .
docker run -d --name frontend -p 3000:80 frontend:1.0.
per compilare il front end

 docker-compose up --build
 per compilare il backend

 localhost:3000