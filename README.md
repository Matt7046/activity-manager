#per compilare il front end
    docker network create backend_app-network || true
    docker build -t frontend:1.0.0 .
    docker rm -f frontend

#per avviare due istanze

    docker run -d --name frontend --network backend_app-network -p 3000:80 frontend:1.0.0 
    docker run -d --name frontend --network backend_app-network -p 3001:80 frontend:1.0.0

#per containerizzate il backend con 3 istanze di ogni microservizio.

    docker-compose up --scale activity-service=3 --scale register-service=3 --scale about-service=3 --scale points-service=3 --scale log-activity-service=3 --scale auth-service=3 --scale family-service=3 --scale notification-service=3

#FILE ENV EMPY

    # Database MongoDB
    MONGO_URI=
    MONGO_DB=
    
    # RabbitMQ
    RABBITMQ_HOST=
    RABBITMQ_PORT=
    RABBITMQ_USER=
    RABBITMQ_PASSWORD=
    
    # Elasticsearch
    ELASTIC_URIS=
    ELASTIC_USER=
    ELASTIC_PASSWORD=
    ELASTIC_BUNDLE_PASSWORD=
    
    # Servizi Esterni (API Keys)
    GPT_TOKEN=
    YOUTUBE_API_KEY=
    CLOUDINARY_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    
    # Email
    EMAIL_USER=
    EMAIL_PASSWORD=
    EMAIL_FROM=
    
    # Sicurezza e Cifratura
    APP_SECRET_KEY=
    APP_CRYPT_KEY=
    APP_USER_NAME=
    APP_USER_KEY=
    
    # Indirizzi
    ADDRESS_1=
ADDRESS_2=


