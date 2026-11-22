# Employee Task Management System

Full-stack app for assigning and tracking employee tasks.

**Stack:** Java 17, Spring Boot 3.5.x, Maven, PostgreSQL, Spring Security + JWT (later), React (Vite) + Tailwind CSS, Docker, GitHub Actions.

We build this in small stages so every file is interview-explainable.

## Stage 1 (done) — project skeleton

- `backend/` Spring Boot 3 app with package folders and `GET /api/health`
- `frontend/` React + Vite + Tailwind landing page

## Stage 2 (done) — database and CRUD

- PostgreSQL via `docker-compose.yml`
- JPA entities: Department, Employee, Task
- Full CRUD under `/api/departments`, `/api/employees`, `/api/tasks`
- Employee list: pagination + search by name
- DTOs + validation + global exception handler
- Swagger UI at `/swagger-ui.html`
- Employee MockMvc + service unit tests

## Later stages

3. Spring Security + JWT
4. More React screens (login, dashboard, employees, tasks)
5. App Docker image + CI (GitHub Actions)

## How to run

### 1) Start PostgreSQL

```bash
docker compose up -d
```

Postgres is exposed on **host port 5433** (avoids clashing with a local Postgres on 5432).
Default JDBC URL: `jdbc:postgresql://localhost:5433/etms` (user/password: `etms` / `etms`).

### 2) Backend (port 8080)

```bash
cd backend
mvnw.cmd spring-boot:run
```

- Health: http://localhost:8080/api/health
- Swagger: http://localhost:8080/swagger-ui.html

Optional env overrides: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`

### 3) Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

### Tests (use in-memory H2 — Docker not required)

```bash
cd backend
mvnw.cmd test
```
