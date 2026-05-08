# STAGE 1: Build
FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /app
# Cache dependencies first
COPY pom.xml ./pom.xml
COPY common/pom.xml ./common/pom.xml
COPY service/image/pom.xml ./service/image/pom.xml
COPY service/activity/pom.xml ./service/activity/pom.xml
COPY service/userPoint/pom.xml ./service/userPoint/pom.xml
COPY service/family/pom.xml ./service/family/pom.xml
COPY service/notification/pom.xml ./service/notification/pom.xml
COPY service/auth/pom.xml ./service/auth/pom.xml
RUN mvn -pl service/auth -am -DskipTests dependency:go-offline
# Copy sources and build
COPY . .
RUN mvn -pl service/auth -am -DskipTests package

# STAGE 2: Runtime
FROM mcr.microsoft.com/openjdk/jdk:17-azurelinux
WORKDIR /app
# Copia il JAR generato (modifica il nome se necessario)
COPY --from=build /app/service/auth/target/auth-service-1.0.0.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
