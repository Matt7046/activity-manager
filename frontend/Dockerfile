# Usa l'immagine di base di Node.js 14
FROM node:14-alpine as builder

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia il file package.json e package-lock.json
COPY package.json package-lock.json ./

# Installa le dipendenze
RUN npm install

# Copia tutti i file sorgenti nel container
COPY . .

# Costruisci l'app per la produzione
RUN npm run build

# Usa un'immagine più leggera per servire il front-end
FROM nginx:alpine

# Copia i file buildati nella directory predefinita di Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Espone la porta 80 per il front-end
EXPOSE 80

# Comando di avvio per Nginx
CMD ["nginx", "-g", "daemon off;"]
