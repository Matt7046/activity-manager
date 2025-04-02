# Usa un'immagine di base di Docker
FROM docker:19.03.12

# Installa Docker Compose
RUN apk add --no-cache py3-pip && \
    pip3 install docker-compose

# Definisci il punto di partenza per il container
ENTRYPOINT ["sh", "-c", "cd /path/to/activity-manager && docker-compose -f /path/to/backend/docker-compose.yml up"]

# Aggiungi altre configurazioni se necessario
