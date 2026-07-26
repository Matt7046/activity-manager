# Deploy produzione Activity Manager

Flusso che usavi a mano, automatizzato:

1. Commit su **main** (lo fai tu)
2. Merge **main → production** (+ push)
3. `docker compose` **build** dell’immagine Hub
4. **push** su Docker Hub
5. Sul VPS: `docker compose pull` + `up -d` **solo** quel servizio (repliche `-1`/`-2`)

## Setup una tantum

```bat
copy config.bat.example config.bat
notepad config.bat
```

Imposta almeno:

- `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_PATH` (es. `/root/app/backend`)
- `DEPLOY_COMPOSE_FILE=docker-compose.prod.yml` (stesso file della cartella `prod`)
- Preferibile: chiave SSH in `DEPLOY_SSH_KEY` (evita password in chiaro)

Build locale: `cd` in `backend\` + `docker-compose.prod.yml` (identico a `prod\REBUILD-*.BAT`).
Sul VPS il comando remoto usa `;` al posto di `&&` così Windows non esegue `docker compose` in locale nella cartella `deploy`.

`config.bat` è in `.gitignore`.

## Comandi

| Script | Cosa aggiorna |
|--------|----------------|
| `DEPLOY-FRONTEND.BAT` | solo frontend |
| `DEPLOY-ACTIVITY.BAT` | activity-service |
| `DEPLOY-AUTH.BAT` | auth-service |
| `DEPLOY-NOTIFICATION.BAT` | notification-service |
| `DEPLOY-IMAGE.BAT` | image-service |
| `DEPLOY-USERPOINT.BAT` | user-point-service |
| `DEPLOY-ALL-SERVICES.BAT` | tutti i microservizi (no frontend) |
| `DEPLOY-ALL-SERVICES-AND-FRONTEND.BAT` | tutto |

Skip parziali:

```bat
set DEPLOY_SKIP_GIT=1
set DEPLOY_SKIP_BUILD=1
set DEPLOY_SKIP_PUSH=1
set DEPLOY_SKIP_SERVER=1
DEPLOY-FRONTEND.BAT
```

Build veloce con cache Docker: `DEPLOY_USE_CACHE=1` (default in `config.bat.example`).

## Nota

Gli script **non avviano** i container sulla macchina di build: solo build+push, poi aggiornano il server. Per rebuild locale usa ancora `prod\REBUILD-*.BAT`.
