# ========== Stage 1: build the Spring Boot jar with Maven ==========
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the whole backend module and build the fat jar.
COPY pom.xml .
COPY src ./src
# Skip tests here — CI already runs them. Keeps image builds faster.
RUN mvn -B -DskipTests package

# ========== Stage 2: slim JRE runtime ==========
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Non-root user: if the process is compromised, it has fewer OS privileges.
RUN addgroup -S etms && adduser -S etms -G etms

# Copy the fat jar produced by the build stage.
COPY --from=build /app/target/employee-task-management-*.jar app.jar

RUN chown etms:etms app.jar
USER etms

EXPOSE 8080

# JVM runs the Spring Boot executable jar.
ENTRYPOINT ["java", "-jar", "app.jar"]
