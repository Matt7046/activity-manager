# Avvio in locale (istanza singola per servizio)

## Frontend in sviluppo
    npm run dev

## Stack Docker locale (backend + nginx + frontend containerizzato)
    docker compose -f backend/docker-compose.localhost.yml down
    docker compose -f backend/docker-compose.localhost.yml up --build

> Nota: in locale non usiamo piu lo scaling con `--scale`.
> Il file `docker-compose.localhost.yml` avvia una sola istanza per ogni microservizio.

## Frontend env (`.env.local`)
    # Client
    NEXT_PUBLIC_IMAGE_SERVER=
    NEXT_PUBLIC_CLIENT_GOOGLE_ID=


## Backend env (`backend/local.env`)

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
    ADDRESS_3=

