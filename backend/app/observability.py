"""Logging, metrics, and tracing setup — the three pillars of observability.

- Logs    -> stdlib `logging`, one logger per module (`logging.getLogger(__name__)`).
- Metrics -> prometheus-client, exposed at `GET /metrics` by the FastAPI app.
- Traces  -> OpenTelemetry SDK with a **console exporter**: spans print to stdout
             as they happen, so no collector/backend is needed for the demo.

Usage:
    from app.observability import tracer
    tracer.start_as_current_span("my.operation") ...

ponytail: a console span exporter instead of an OTLP collector keeps this
dependency-free for the class. Point it at a collector when real distributed
tracing is needed.
"""
from __future__ import annotations

import logging

import prometheus_client
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

from app.config import settings


def setup_logging() -> None:
    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def setup_tracing() -> trace.Tracer:
    provider = TracerProvider()
    # SimpleSpanProcessor flushes each span immediately so students see traces
    # in the console as they happen (BatchSpanProcessor would buffer them).
    provider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))
    trace.set_tracer_provider(provider)
    return trace.get_tracer("todo-app")


setup_logging()
tracer = setup_tracing()

# --- Metrics -----------------------------------------------------------------
# Counters/histograms live on the default Prometheus registry and are served at
# /metrics. Labels follow {method, path} where path is the route template
# (e.g. /api/v1/todos/{todo_id}), keeping cardinality bounded.
http_requests_total = prometheus_client.Counter(
    "http_requests_total",
    "Total HTTP requests handled",
    ["method", "path", "status"],
)
http_request_duration_seconds = prometheus_client.Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "path"],
)