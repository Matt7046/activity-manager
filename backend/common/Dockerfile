# syntax=docker/dockerfile:1.4
FROM maven:3.9-amazoncorretto-17 AS builder

WORKDIR /app

COPY pom.xml ./pom.xml
COPY common/pom.xml ./common/pom.xml
RUN --mount=type=cache,target=/root/.m2,id=activity-manager-maven \
    mvn -pl common -am -DskipTests dependency:go-offline dependency:resolve-plugins

COPY . .

RUN --mount=type=cache,target=/root/.m2,id=activity-manager-maven \
    mvn -pl common -am -DskipTests install
