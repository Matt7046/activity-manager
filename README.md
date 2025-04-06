#per compilare il front end

    docker build -t frontend:1.0.0 .
    docker rm -f frontend

#per avviare due istanze

    docker run -d --name frontend --network backend_app-network -p 3000:80 frontend:1.0.0 
    docker run -d --name frontend --network backend_app-network -p 3001:80 frontend:1.0.0

#per containerizzate il backend con 3 istanze di ogni microservizio.

    docker-compose up --scale activity-service=3 --scale register-service=3 --scale about-service=3 --scale points-service=3 --scale log-activity-service=3 --scale auth-service=3 --scale family-service=3 --scale notification-service=3
