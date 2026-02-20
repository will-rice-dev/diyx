# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
./mvnw clean package

# Run
./mvnw spring-boot:run

# Run tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=DiyxApplicationTests

# Compile only
./mvnw compile
```

## Architecture

**DIYX** is a Spring Boot 4.0.2 REST API for user authentication and settings management, using Java 25.

### Tech Stack
- **Spring Boot** with Spring Security and Spring Data JPA
- **SQLite** (file at `model/diyx.db`) managed by **Flyway** migrations
- **JWT** (JJWT) for stateless auth; **BCrypt** for password hashing
- **Hibernate** with `SQLiteDialect`

### Package Structure (`com.willricedev.diyx`)
- `auth/` — `JwtService` (token creation/validation), `JwtAuthFilter` (per-request JWT extraction)
- `config/` — `SecurityConfig` (filter chain, public vs protected routes), `FlywayConfig`
- `user/` — `User` entity, `UserRepository`, `UserService`, `UserController`, `SettingsController`, and `dto/` subpackage

### Request Flow
1. `JwtAuthFilter` extracts the Bearer token from `Authorization` header and sets the `SecurityContext`
2. `SecurityConfig` permits `/api/auth/**` publicly; all other routes require authentication
3. Controllers delegate to `UserService` for business logic and `UserRepository` for persistence

### Key Endpoints
- `POST /api/auth/register` — create user, returns JWT
- `POST /api/auth/login` — validate credentials, returns JWT
- `GET /api/users/me/settings` — get current user settings (JWT required)
- `PATCH /api/users/me/settings` — update settings (JWT required)

### Database
- Schema managed by Flyway; `spring.jpa.hibernate.ddl-auto=none`
- Migrations in `src/main/resources/db/migration/`
- `InstantConverter` bridges Java `Instant` to SQLite text storage

### Configuration (`application.properties`)
- `app.jwt.secret` — Base64-encoded secret (replace in production via env var)
- `app.jwt.expiration-ms=86400000` — 24-hour token lifetime
- `spring.datasource.url=jdbc:sqlite:./model/diyx.db`
