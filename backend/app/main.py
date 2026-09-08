from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from opentelemetry import trace
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from app.config import settings
from app.database import Base, engine
from app.observability import http_request_duration_seconds, http_requests_total, tracer
from app.routers import auth, todos

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # ponytail: create_all instead of Alembic migrations keeps the teaching example
    # minimal. Add Alembic when schema changes across deployed environments matter.
    # Guarded so the app still boots if Postgres is down (e.g. before docker compose up).
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema ready")
    except Exception as exc:  # noqa: BLE001 - DB not ready yet; will retry on next boot
        logger.warning("Database unavailable at startup: %s", exc)
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
    public_paths = {"/health", "/metrics", "/api/v1/auth/signin"}
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


@app.middleware("http")
async def observe_request(request: Request, call_next):
    """Metrics + trace span for every request (three pillars, exposure level)."""
    route = request.scope.get("route")
    path = route.path if route else request.url.path
    start = time.perf_counter()
    with tracer.start_as_current_span(f"{request.method} {path}") as span:
        try:
            response = await call_next(request)
        except Exception:
            http_requests_total.labels(request.method, path, "500").inc()
            span.record_exception()
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise
        duration = time.perf_counter() - start
        http_requests_total.labels(request.method, path, str(response.status_code)).inc()
        http_request_duration_seconds.labels(request.method, path).observe(duration)
        span.set_attribute("http.status_code", response.status_code)
        span.set_attribute("http.method", request.method)
        return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Return validation errors as a simple JSON shape instead of FastAPI's default."""
    logger.warning("Validation error on %s: %s", request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/health", tags=["meta"], summary="Health check")
def health() -> dict:
    return {"status": "ok"}


@app.get("/metrics", tags=["meta"], summary="Prometheus metrics")
def metrics() -> Response:
    """Expose Prometheus-formatted metrics for scraping."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
