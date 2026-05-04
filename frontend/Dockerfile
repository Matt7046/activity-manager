# Fase 1: Builder
# Utilizziamo Node 20 (LTS) per soddisfare i requisiti di Next.js >= 20.9.0
FROM node:20-alpine AS builder

WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package.json package-lock.json ./

# Installazione con --legacy-peer-deps per gestire i conflitti MUI v6/React 18
RUN npm install --legacy-peer-deps

# Copia tutto il codice sorgente
COPY . .

# Costruisci l'applicazione Next.js
RUN npm run build

# Fase 2: Runner (Produzione)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiamo i file necessari dalla fase di build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Espone la porta 3000 (standard per Next.js)
EXPOSE 3000

# Avviamo il server Next.js
CMD ["npm", "start"]