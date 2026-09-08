# Sample Full-Stack Todo App (Senior Capstone)

A sample full-stack todo application built as a teaching example for a senior
capstone class. The **backend** is the focus of this repo and lives in
[`backend/`](backend/). It demonstrates the fundamentals a capstone project needs:

- **CRUD operations** against a relational database
- **Authentication** via Firebase (ID-token verification)
- **API management** with an OpenAPI contract and generated clients
- **Error handling** and consistent HTTP semantics
- **Unit + integration testing**
- **Docker** for local database setup

This repo intentionally publishes not just the app code but also the **OpenAPI
contract**, the **generated clients**, and an **opencode agent** so student
teams can collaborate with the same tooling.

---

## Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| API        | [FastAPI](https://fastapi.tiangolo.com/) (Python)                        |
| Database   | PostgreSQL via SQLAlchemy 2.x ORM                                        |
| Auth       | Firebase Auth (Admin SDK verifies ID tokens)                             |
| Contract   | OpenAPI 3.x (auto-generated from FastAPI)                                |
| Clients    | Generated with `openapi-generator-cli` (TypeScript/axios + Python)       |
| Testing    | pytest (unit, offline) + pytest (integration, real stack)                |
| Runtime    | Python 3.12, Docker (Postgres 16)                                        |

---

## Project structure

```
.
├── backend/                    # The backend application (focus of this repo)
│   ├── app/
│   │   ├── main.py             # FastAPI app, OpenAPI schema, error handlers
│   │   ├── config.py           # Environment-driven settings
│   │   ├── database.py         # Engine, session, Base
│   │   ├── models.py           # SQLAlchemy models (User, Todo)
│   │   ├── schemas.py          # Pydantic request/response models
│   │   ├── crud.py             # Database operations
│   │   ├── auth.py             # Firebase verification + current-user dependency
│   │   └── routers/
│   │       ├── auth.py         # /auth/signin, /auth/users/me
│   │       └── todos.py        # Todo CRUD endpoints
│   ├── tests/                  # Unit tests (offline, mocked Firebase)
│   ├── tests-integration/      # Generated Python client + integration tests
│   ├── contracts/openapi.json  # Committed OpenAPI spec snapshot
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .sample.env
├── clients/
│   └── typescript/             # Generated TypeScript (axios) client
├── scripts/
│   ├── setup.sh                # Create venv + install backend deps
│   └── generate-clients.sh     # Regenerate OpenAPI spec + clients
├── docker-compose.yaml         # Local Postgres (hardcoded dev creds)
├── README.md
└── CHANGELOG.md
```

---

## API endpoints & features (one endpoint per feature)

All routes are prefixed with `/api/v1` and require a Firebase ID token via
`Authorization: Bearer <token>` (except `/auth/signin` and `/health`).

| Method | Path                 | Feature                          |
| ------ | -------------------- | -------------------------------- |
| POST   | `/auth/signin`       | Authenticate with a Firebase token |
| GET    | `/auth/users/me`     | Get the current user             |
| POST   | `/todos`             | Create a todo                    |
| GET    | `/todos`             | Get all todos (owned by caller)  |
| GET    | `/todos/{id}`        | Get a todo by id                 |
| PUT    | `/todos/{id}`        | Update a todo by id              |
| DELETE | `/todos/{id}`        | Delete a todo by id              |
| GET    | `/health`            | Health check                     |
| GET    | `/metrics`           | Prometheus metrics               |

Interactive docs are available at `http://localhost:8000/docs` (Swagger UI)
when the API is running.

### Contracts

The backend is the source of truth for the API contract. FastAPI derives the
OpenAPI schema from the route handlers and Pydantic models, and we commit a
snapshot to [`backend/contracts/openapi.json`](backend/contracts/openapi.json).
Generated clients in `clients/typescript/` and `backend/tests-integration/` are
built from that snapshot, so the TypeScript frontend and the Python integration
tests always speak the same contract as the server.

To regenerate the spec and clients after changing an endpoint:

```bash
bash scripts/generate-clients.sh
```

---

## Prerequisites

- Python 3.12
- Docker (for the local Postgres container)
- Java + Node/npx (only needed to regenerate clients)

---

## Getting started

### 1. Set up the Python environment

```bash
bash scripts/setup.sh
```

This creates `backend/.venv` and installs the backend dependencies.

### 2. Start Postgres

```bash
docker compose up -d db
```

This starts a `postgres:16` container with the hardcoded dev credentials from
`docker-compose.yaml` (`app` / `app` / database `todo`).

### 3. Configure environment

```bash
cp backend/.sample.env backend/.env
# then edit backend/.env:
#   - FIREBASE_PROJECT_ID
#   - FIREBASE_SERVICE_ACCOUNT_JSON (absolute path to your service account file)
```

### 4. Run the API

```bash
source backend/.venv/bin/activate
uvicorn app.main:app --reload --app-dir backend
```

The API is now at `http://localhost:8000` with docs at
`http://localhost:8000/docs`.

---

## Firebase setup (auth example)

Because Firebase auth is a course requirement, setting it up here serves as an
example of how a client connects to an auth provider:

1. Create a project at https://console.firebase.google.com/.
2. Enable the **Email/Password** sign-in provider under
   **Authentication → Sign-in method**.
3. In **Project settings → Service accounts**, click **Generate new private key**
   and save the JSON file.
4. Point `FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env` at that file.
5. From your frontend, use the Firebase web SDK to sign in a user and obtain an
   **ID token**, then send it to `POST /auth/signin` and use the returned token
   as `Authorization: Bearer <token>`.

The backend only *verifies* ID tokens via the Admin SDK — it does not mint them.
This keeps the server thin: the client owns the Firebase sign-in flow.

> The API boots without Firebase credentials and returns `401` on authenticated
> routes until a service account is configured.

---

## Tests

### Unit tests (offline)

These mock the Firebase verifier and use an in-memory SQLite DB, so they run
anywhere with no external services:

```bash
backend/.venv/bin/pytest backend/tests -v
```

Covers CRUD, ownership scoping (a user can only see/modify their own todos),
401s on bad/missing tokens, and 404 on missing resources.

### Integration tests (real stack)

These use the **generated Python client** against a running API + Postgres and a
real Firebase ID token. They skip gracefully when credentials aren't present:

```bash
backend/.venv/bin/pytest backend/tests-integration -v
```

To actually run them you need a real ID token. Mint one with the Firebase Admin
SDK using your service account, then:

```bash
export FIREBASE_ID_TOKEN="<your-id-token>"
export API_BASE_URL="http://localhost:8000/api/v1"
backend/.venv/bin/pytest backend/tests-integration -v
```

---

## Observability (the three pillars)

The backend includes basic exposure to all three pillars of observability.

| Pillar   | Implementation | Where to look |
| -------- | -------------- | ------------- |
| Logs     | stdlib `logging`, per-module loggers | Startup/lifespan, todo CRUD events, auth failures, validation errors |
| Metrics  | `prometheus-client`, exposed at `GET /metrics` | Request counters + latency histogram with `method`/`path`/`status` labels |
| Traces   | OpenTelemetry SDK with a **console exporter** | A span per request plus a span around the Firebase token verification — printed to stdout as they happen |

- Change logging verbosity with `LOG_LEVEL` in `backend/.env` (DEBUG, INFO, WARNING, ERROR).
- Metrics are in Prometheus text format, so `prometheus` can scrape `http://localhost:8000/metrics` and Grafana can graph them.
- Traces print to stdout via the console exporter — no collector required. This is
  intentional: students can see spans without setting up an observability backend.
  (ponytail: swap the console exporter for an OTLP one when real tracing is needed.)

```bash
curl http://localhost:8000/metrics   # view metrics
# run the API and look at stdout for log lines and span JSON
```

---

## Docker

- [`docker-compose.yaml`](docker-compose.yaml) runs only Postgres for local dev
  (the app itself runs directly via `uvicorn`). Credentials are hardcoded for
  teaching; never use these in production.
- [`backend/Dockerfile`](backend/Dockerfile) packages the API itself if you want
  to run the whole stack in containers:

  ```bash
  docker build -t todo-backend -f backend/Dockerfile backend
  docker run -p 8000:8000 --env-file backend/.env todo-backend
  ```

---

## opencode agent

`.opencode/agent/backend.md` defines an opencode agent with knowledge of this
application. Contributors can delegate backend tasks to it, and it knows the
project structure, how to run and test the app, and how to regenerate clients.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
