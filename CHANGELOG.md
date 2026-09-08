# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Feature

- FastAPI backend in `backend/app/` with:
  - Todo CRUD endpoints (create, list, get, update, delete by id)
  - Firebase Auth integration (ID-token verification via the Admin SDK)
  - `GET /auth/users/me` current-user endpoint
  - Global validation error handler
  - OpenAPI spec with a documented `bearerAuth` security scheme
- PostgreSQL integration via SQLAlchemy 2.x ORM (`User`, `Todo` models with
  ownership scoping)
- `docker-compose.yaml` with a local Postgres 16 container (hardcoded dev creds)
- `backend/.sample.env` documenting required configuration
- `backend/Dockerfile` to package the API
- Unit tests (`backend/tests/`) — offline, Firebase mocked, 18 cases
- Integration tests (`backend/tests-integration/`) — use the generated Python
  client, skip gracefully without credentials
- OpenAPI contract snapshot (`backend/contracts/openapi.json`)
- Generated clients via openapi-generator:
  - TypeScript/axios in `clients/typescript/`
  - Python in `backend/tests-integration/`
- Client generation script (`scripts/generate-clients.sh`) and venv setup
  (`scripts/setup.sh`)
- Root `README.md` documenting the project, stack, contracts, and run steps
- `CHANGELOG.md` (this file)
- opencode agent at `.opencode/agent/backend.md`
- Observability (the three pillars), focused on exposure/example:
  - **Logs**: stdlib `logging` with per-module loggers for startup/lifespan, todo
    CRUD events, auth failures, and validation errors; `LOG_LEVEL` setting
  - **Metrics**: `prometheus-client` with request counter + latency histogram,
    exposed at `GET /metrics`
  - **Traces**: OpenTelemetry SDK with a console span exporter; a span per request
    and around Firebase token verification

### Bugfixes

- Corrected the OpenAPI security scheme so protected endpoints reference the
  documented `bearerAuth` scheme instead of FastAPI's auto-added `HTTPBearer`,
  and `/health` + `/auth/signin` are correctly public.
- Removed the redundant `Makefile` in favor of the documented shell commands.
- Excluded openapi-generator markdown docs, `git_push.sh`, and generated
  GitHub/GitLab CI scaffolding from the repo (`.gitignore` +
  `.openapi-generator-ignore`).
- Added `GET /metrics` (public) to the OpenAPI contract and regenerated clients.
