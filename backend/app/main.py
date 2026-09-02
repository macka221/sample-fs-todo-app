from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine
from app.routers import auth, todos


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # ponytail: create_all instead of Alembic migrations keeps the teaching example
    # minimal. Add Alembic when schema changes across deployed environments matter.
    # Guarded so the app still boots if Postgres is down (e.g. before docker compose up).
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:  # noqa: BLE001 - DB not ready yet; will retry on next boot
        pass
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
    description=(
        "Sample todo backend for a senior capstone class. Demonstrates CRUD, "
        "auth (Firebase), error handling, and database integration."
    ),
    openapi_tags=[
        {"name": "auth", "description": "Authentication with Firebase ID tokens"},
        {"name": "todos", "description": "Todo CRUD operations"},
    ],
)

# The generated clients need to know how to send the bearer token.
app.openapi_schema = None  # force regeneration below


def _openapi() -> dict:
    from fastapi.openapi.utils import get_openapi

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
    )
    schema["components"]["securitySchemes"]["bearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Firebase ID token. Obtain it from `POST /auth/signin`.",
    }
    # Remove FastAPI's auto-added HTTPBearer scheme/references so generated
    # clients only see the single, documented bearerAuth scheme.
    schema["components"]["securitySchemes"].pop("HTTPBearer", None)
    # Paths that genuinely require no authentication.
    public_paths = {"/health", "/api/v1/auth/signin"}
    for path, operations in schema["paths"].items():
        for method in ["get", "post", "put", "delete", "patch"]:
            op = operations.get(method)
            if op is None:
                continue
            if path in public_paths:
                op.pop("security", None)
            else:
                op["security"] = [{"bearerAuth": []}]
    return schema


app.openapi = _openapi  # type: ignore[method-assign]

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(todos.router, prefix=settings.api_prefix)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Return validation errors as a simple JSON shape instead of FastAPI's default."""
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/health", tags=["meta"], summary="Health check")
def health() -> dict:
    return {"status": "ok"}
