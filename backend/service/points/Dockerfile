# STAGE 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
# Copia tutto il contenuto del modulo activity-service
COPY . .
# Esegui la build (salta i test per velocizzare)
RUN mvn clean package
ENV JAVA_TOOL_OPTIONS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5006"
# STAGE 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copia il JAR generato (modifica il nome se necessario)
COPY --from=build /app/service/points/target/points-service-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
