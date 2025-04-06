FROM maven:3.8.5-openjdk-17-slim AS builder

WORKDIR /app

# Copia tutto il progetto nella directory di lavoro
COPY . .

# Costruisci solo il modulo `common`
RUN mvn clean install -pl common -am -DskipTests

