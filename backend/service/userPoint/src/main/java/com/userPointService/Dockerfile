# STAGE 1: Build del progetto
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copia tutto il contenuto del progetto nella directory di lavoro
COPY . .

# Costruisci il JAR (salta i test per velocizzare)
RUN mvn clean package -DskipTests -Pspring-boot

# STAGE 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copia il JAR dalla fase di build
COPY --from=build /app/target/points-service-1.0.0.jar app.jar

# Espone la porta (scegli la porta che hai configurato per Activity, esempio 8082)
EXPOSE 8082

# Comando per avviare l'app
ENTRYPOINT ["java", "-jar", "app.jar"]
