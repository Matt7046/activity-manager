# Avvio in locale (istanza singola per servizio)

## Frontend in sviluppo

- **`npm run dev`** (in `frontend/`): esegue `scripts/run-dev.cjs` — carica **`frontend/.env`** poi **`frontend/local.env`** con priorità a **`local.env`** (stesso criterio di `backend/docker-compose.localhost.yml` con `env_file: local.env`).
- **`dev-frontend-local.bat`** (nella root del repo): entra in `frontend` e lancia `npm run dev` (utile su Windows come scorciatoia).

## Stack Docker locale (backend + nginx + frontend containerizzato)
    docker compose -f backend/docker-compose.localhost.yml down
    docker compose -f backend/docker-compose.localhost.yml up --build

> Nota: in locale non usiamo piu lo scaling con `--scale`.
> Il file `docker-compose.localhost.yml` avvia una sola istanza per ogni microservizio.

## Frontend env (`.env` + opzionale `local.env`)

In `frontend/`:

- **`.env`** — unico file necessario **in produzione** (o valori di default in repo / pipeline).
- **`local.env`** — **solo in locale**, opzionale: se esiste, viene caricato dopo `.env` e **sovrascrive** le stesse chiavi (come sul backend). In produzione di solito non c’è: Next usa allora **solo** `.env`.

Le chiavi sono quelle in `frontend/.env.EMPTY`.

Per **build immagine Docker** del frontend: `frontend/.dockerignore` esclude **`local.env`** dal contesto di build, così anche se sul PC hai sia `.env` sia `local.env`, nell’immagine non entra `local.env` e non sovrascrive i valori di produzione (resta solo ciò che copi / inject come `.env` o variabili in pipeline).

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

