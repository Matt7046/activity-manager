# STAGE 1: Build
FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /app
# Copia tutto il contenuto del modulo activity-service
COPY . .
# Esegui la build (salta i test per velocizzare)
RUN mvn clean package 
ENV JAVA_TOOL_OPTIONS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5011"

# STAGE 2: Runtime
FROM mcr.microsoft.com/openjdk/jdk:17-azurelinux
WORKDIR /app
# Copia il JAR generato (modifica il nome se necessario)
COPY --from=build /app/service/family/target/family-service-1.0.0.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
