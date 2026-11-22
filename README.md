# Employee Task Management System

Full-stack app for assigning and tracking employee tasks.

**Stack:** Java 17, Spring Boot 3.5.x, Maven, PostgreSQL, Spring Security + JWT, React (Vite) + Tailwind CSS, Docker, GitHub Actions.

We build this in small stages so every file is interview-explainable.

## Stages done

1. Project skeleton (Spring Boot + React)
2. Database + CRUD APIs
3. Spring Security + JWT
4. React UI (login, dashboard, CRUD pages)
5. **Docker + GitHub Actions CI**

## Quick start with Docker (all services)

```bash
# Optional: copy env template and edit secrets
copy .env.example .env

docker compose up --build
```

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Actuator health: http://localhost:8080/actuator/health
- Swagger: http://localhost:8080/swagger-ui.html
- Postgres (host): `localhost:5433`

Stop with `docker compose down`.

## Local development (without full compose)

### Postgres only

```bash
docker compose up -d postgres
```

### Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

### Frontend (Vite)

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

### Tests / CI locally

```bash
cd backend
mvnw.cmd test

cd ../frontend
npm ci
npm run build
```

## Environment variables

See root `.env.example`. Important ones:

| Variable | Purpose |
|---|---|
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` / `JWT_EXPIRATION_MS` | Token signing |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins (comma-separated) |
| `VITE_API_URL` | API URL baked into the React build |
