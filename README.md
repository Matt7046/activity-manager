# Avvio in locale (istanza singola per servizio)

## Frontend in sviluppo

- **`npm run dev`** (in `frontend/`): esegue `scripts/run-dev.cjs` — carica **`frontend/.env`** poi **`frontend/local.env`** con priorità a **`local.env`** (stesso criterio di `backend/docker-compose.localhost.yml` con `env_file: local.env`).
- **`backend/batavviodocker/dev-frontend-local.bat`**: entra in `frontend/` e lancia `npm run dev` (`.env` + `local.env`).

## Stack Docker locale (backend + nginx + frontend containerizzato)
    docker compose -f backend/docker-compose.localhost.yml down
    docker compose -f backend/docker-compose.localhost.yml up --build

I Dockerfile dei microservizi usano **BuildKit** con cache Maven condivisa (`/root/.m2`, id `activity-manager-maven`). I BAT in `backend/batavviodocker` impostano `DOCKER_BUILDKIT=1`. In produzione, per rebuild più rapidi: `set PROD_REBUILD_USE_CACHE=1` prima di `PROD_SERVICE_REBUILD.BAT`.

> Nota: in locale non usiamo piu lo scaling con `--scale`.
> Il file `docker-compose.localhost.yml` avvia una sola istanza per ogni microservizio.

## Frontend env (`.env` + opzionale `local.env`)

In `frontend/`:

- **`.env`** — valori **produzione** (branch `production`, build Docker prod, `REBUILD-FRONTEND` in `batavviodocker/prod`).
- **`local.env`** — **solo sviluppo** su branch `main`: caricato dopo `.env` e **sovrascrive** le stesse chiavi. Su branch `production` (o con `FRONTEND_USE_LOCAL_ENV=0`) viene **ignorato**.

Regole automatiche (`frontend/scripts/load-frontend-env.cjs`):

| Situazione | File usati |
|------------|------------|
| Branch `main` + `npm run dev` | `.env` → `local.env` |
| Branch `production` o BAT `batavviodocker/prod` (Docker) | solo `.env` → URL prod |
| BAT `batavviodocker/locale` + `REBUILD-FRONTEND` (Docker) | `.env` + `frontend/local.env` → tipicamente localhost |
| Override | `FRONTEND_USE_LOCAL_ENV=1` forza `local.env`; `=0` lo esclude |

Docker build frontend: `frontend/.dockerignore` non esclude più `local.env` (necessario per `docker-compose.localhost.yml` + `FRONTEND_USE_LOCAL_ENV=1`). In CI produzione non lasciare `local.env` nel contesto se non serve.

Le chiavi sono quelle in `frontend/.env.EMPTY` / `local.env.EMPTY`.

Per **build immagine Docker** del frontend: `frontend/.dockerignore` esclude **`local.env`** dal contesto di build, così anche se sul PC hai sia `.env` sia `local.env`, nell’immagine non entra `local.env` e non sovrascrive i valori di produzione (resta solo ciò che copi / inject come `.env` o variabili in pipeline).

## Backend env (`backend/local.env` `backend/.env`)

    # Database MongoDB
    MONGO_URI=
    MONGO_DB=

    # RabbitMQ
    RABBITMQ_HOST=
    RABBITMQ_PORT=
    RABBITMQ_USER=
    RABBITMQ_PASSWORD=
    RABBITMQ_DEFAULT_USER=
    RABBITMQ_DEFAULT_PASS=

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
    GOOGLE_CLIENT_ID=

    # OAuth social login (auth-service: GitHub code exchange, Facebook token)
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    FACEBOOK_APP_ID=
    FACEBOOK_APP_SECRET=

    # Email Gmail API + OAuth (solo notification-service)
    EMAIL_ENABLED=
    EMAIL_PROVIDER=
    EMAIL_FROM=
    GMAIL_OAUTH_CLIENT_ID=
    GMAIL_OAUTH_CLIENT_SECRET=
    GMAIL_OAUTH_REFRESH_TOKEN=

    # Sicurezza e Cifratura
    APP_SECRET_KEY=
    APP_CRYPT_KEY=
    APP_USER_NAME=
    APP_USER_KEY=

    # Indirizzi
    ADDRESS_1=
    ADDRESS_2=
    ADDRESS_3=

## Frontend env (`frontend/local.env` `frontend/.env`)    
   

    # URL pubblico del frontend (senza slash finale). Usato per Open Graph, manifest PWA e link assoluti.
    NEXT_PUBLIC_SITE_URL=

    # Base delivery immagini Cloudinary, con segmento /image/upload/ (non /image/v).
    NEXT_PUBLIC_IMAGE_SERVER=

    # ID client OAuth Google (tipo Web) per il pulsante "Accedi con Google" sul frontend.
    NEXT_PUBLIC_CLIENT_GOOGLE_ID=

    # Client ID dell'OAuth App GitHub (Settings → Developer settings → OAuth Apps).
    NEXT_PUBLIC_CLIENT_GITHUB_ID=

    # Redirect URI registrata su GitHub. Deve coincidere con il path /home del callback.
    NEXT_PUBLIC_GITHUB_OAUTH_REDIRECT_URI=

    # App ID Facebook (pubblico) per il login con Facebook. Lasciare vuoto per disabilitare.
    NEXT_PUBLIC_CLIENT_FACEBOOK_APP_ID=

    # Base URL delle API backend (prefisso comune nginx, di solito /api). Senza slash finale.
    NEXT_PUBLIC_SERVICE_URL=

