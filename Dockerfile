# Usa l'immagine di base di OpenJDK
FROM openjdk:17-jdk-slim

# Imposta la directory di lavoro nel contenitore
WORKDIR /app

# Copia il JAR del progetto all'interno del contenitore
COPY target/webApp-0.0.1-SNAPSHOT.jar app.jar

# Espone la porta sulla quale l'applicazione Spring Boot è in ascolto (di default 8080)
EXPOSE 8080

# Esegui il JAR
ENTRYPOINT ["java", "-jar", "app.jar"]