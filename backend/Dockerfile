# Usa l'immagine di base di OpenJDK
FROM openjdk:17-jdk-slim

# Imposta la directory di lavoro nel contenitore
WORKDIR /app

# Copia il JAR del progetto all'interno del contenitore
COPY jar/activityManager-1.5.jar app.jar

# Espone la porta sulla quale l'applicazione Spring Boot è in ascolto (di default 8080)
EXPOSE 8080

# Aggiungi un'opzione per personalizzare gli argomenti di avvio
ENV JAVA_OPTS=""

# Esegui il JAR con eventuali opzioni passate
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
