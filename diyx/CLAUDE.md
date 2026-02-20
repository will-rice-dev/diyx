# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
# Build
./mvnw clean package

# Run application
./mvnw spring-boot:run

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=DiyxApplicationTests

# Run a single test method
./mvnw test -Dtest=DiyxApplicationTests#contextLoads

# Build native image (GraalVM)
./mvnw native:compile

# Inspect dependencies
./mvnw dependency:tree
```

## Architecture

Spring Boot 4 REST API (Java 25, Maven) with SQLite database.

**Package:** `com.willricedev.diyx`

**Layered structure within feature packages** (currently only `user/`):
- `*Controller` — REST endpoints, HTTP status codes, `@ExceptionHandler`
- `*Service` — Business logic, password encoding (BCrypt)
- `*Repository` — Spring Data JPA interface
- `User` — JPA `@Entity`, `@PrePersist` for timestamps
- `dto/` — Request/Response POJOs with validation annotations

**Security:** Spring Security 7 configured in `config/SecurityConfig.java` — stateless, no CSRF, no form login, no HTTP Basic. Only `/api/auth/**` is public; all other routes require authentication.

**Database:** SQLite at `./model/diyx.db` (excluded from git). Schema managed exclusively by Flyway (`src/main/resources/db/migration/`). `ddl-auto=none`. The `InstantConverter` handles `Instant` ↔ `String` conversion required by SQLite's lack of a native timestamp type.

**Current endpoints:**
- `POST /api/auth/register` — creates user (201)
- `POST /api/auth/login` — authenticates user (200)

## Key Constraints

- **Java 25** — use modern Java features freely
- **SQLite limitations** — no native timestamp type; use `InstantConverter` for `Instant` fields. New JPA entities with `Instant` fields need `@Convert(converter = InstantConverter.class)`.
- **Flyway** — all schema changes go in a new versioned migration file (`V{n}__description.sql`), never modify existing migrations.
- **Stateless API** — no sessions; future auth should use tokens (JWT), not cookies.
