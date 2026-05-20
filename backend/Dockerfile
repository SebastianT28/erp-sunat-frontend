# Etapa de construcción (Build stage)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias para aprovechar la caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y empaquetar la aplicación omitiendo pruebas unitarias para agilizar el build
COPY src ./src
RUN mvn package -DskipTests

# Etapa de ejecución (Run stage)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiar el JAR generado desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Configurar el puerto expuesto y comando de inicio
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
