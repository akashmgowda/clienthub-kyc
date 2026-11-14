# ClientHub Spring Boot API — foundation

This is the first backend milestone. It contains the Spring Boot application, PostgreSQL/JPA entity and repository, and a public health endpoint. **It does not implement authentication or expose KYC data APIs yet.** All other endpoints are denied by Spring Security.

## Requirements
- JDK 21
- Maven 3.9+
- PostgreSQL 15+

## Set up PostgreSQL
Create a local database named `clienthub` and a dedicated database user. Apply the SQL in `src/main/resources/db/migration/V1__create_kyc_applications.sql` manually with psql or a SQL editor. This folder is a migration placeholder; Flyway is not yet configured.

Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` as environment variables (do not commit credentials). Example DB URL: `jdbc:postgresql://localhost:5432/clienthub`.

## Run
From the `backend` directory:
```bash
mvn spring-boot:run
```
Open `http://localhost:8080/api/health`. Expected JSON: `{"status":"UP","service":"clienthub-api"}`.

The frontend remains a standalone demo. A later milestone will add JWT authentication, protected REST endpoints, Flyway migrations, DTO validation, and API integration.
