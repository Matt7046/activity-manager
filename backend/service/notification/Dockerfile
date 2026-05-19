# syntax=docker/dockerfile:1.4
# STAGE 1: Build
FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /app
# Dipendenze e plugin Maven in cache BuildKit (id condiviso tra microservizi sullo stesso host)
COPY pom.xml ./pom.xml
COPY common/pom.xml ./common/pom.xml
COPY service/image/pom.xml ./service/image/pom.xml
COPY service/auth/pom.xml ./service/auth/pom.xml
COPY service/activity/pom.xml ./service/activity/pom.xml
COPY service/userPoint/pom.xml ./service/userPoint/pom.xml
COPY service/notification/pom.xml ./service/notification/pom.xml
RUN --mount=type=cache,target=/root/.m2,id=activity-manager-maven \
    mvn -pl service/notification -am -DskipTests \
    dependency:go-offline dependency:resolve-plugins
COPY . .
RUN --mount=type=cache,target=/root/.m2,id=activity-manager-maven \
    mvn -pl service/notification -am -DskipTests package

# STAGE 2: Runtime
FROM mcr.microsoft.com/openjdk/jdk:17-azurelinux
WORKDIR /app
COPY --from=build /app/service/notification/target/notification-service-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
