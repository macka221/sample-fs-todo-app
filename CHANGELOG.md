# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
- Makefile with `setup`, `run`, `test`, `test-integration`, `db-up`, `db-down`,
  and `generate-clients` targets
- Root `README.md` documenting the project, stack, contracts, and run steps
- `CHANGELOG.md` (this file)
- opencode agent at `.opencode/agent/backend.md`
