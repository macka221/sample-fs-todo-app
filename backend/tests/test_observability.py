"""Tests for the observability surface (metrics + health). Logging and tracing
spans are visible in stdout during runs; we assert on the metrics endpoint."""


def test_metrics_endpoint_exposes_counters(client, fake_auth, auth_header):
    # Hit an API route so the middleware records metrics, then inspect /metrics.
    client.post("/api/v1/todos", json={"title": "observe me"}, headers=auth_header)
    resp = client.get("/metrics")
    assert resp.status_code == 200
    assert "text/plain" in resp.headers["content-type"]
    body = resp.text
    assert "http_requests_total" in body
    assert "http_request_duration_seconds" in body


def test_health_endpoint(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}