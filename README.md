# Employee Task Management System

Full-stack app for assigning and tracking employee tasks.

**Stack:** Java 17, Spring Boot 3, Maven, PostgreSQL, Spring Security + JWT, React (Vite) + Tailwind CSS, Docker, GitHub Actions.

We build this in small stages so every file is interview-explainable.

## Stage 1 (done) — project skeleton

- `backend/` Spring Boot 3 app with package folders and `GET /api/health`
- `frontend/` React + Vite + Tailwind landing page
- No database and no login yet

## Later stages

2. PostgreSQL + JPA entities + repositories
3. Request/response DTOs, validation, global exception handler
4. Employee and Task REST APIs
5. Spring Security + JWT
6. Swagger (springdoc-openapi)
7. More JUnit 5 tests
8. React screens (login, dashboard, employees, tasks)
9. Docker
10. GitHub Actions CI

## How to run Stage 1

### Backend (port 8080)

```bash
cd backend
mvnw.cmd spring-boot:run
```

Open [http://localhost:8080/api/health](http://localhost:8080/api/health)

### Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies `/api` to Spring Boot, so start the backend first if you want the green health message.

### Tests

```bash
cd backend
mvnw.cmd test
```
