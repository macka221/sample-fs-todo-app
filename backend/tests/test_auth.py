from __future__ import annotations

import pytest
from fastapi import HTTPException, status


def test_signin_creates_user(client, fake_auth):
    resp = client.post("/api/v1/auth/signin", json={"id_token": "token-student"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"] == "token-student"
    assert body["token_type"] == "bearer"
    assert body["user"]["id"] == "user-123"
    assert body["user"]["email"] == "student@example.com"


def test_signin_is_idempotent(client, fake_auth):
    client.post("/api/v1/auth/signin", json={"id_token": "token-student"})
    second = client.post("/api/v1/auth/signin", json={"id_token": "token-student"})
    assert second.status_code == 200


def test_signin_rejects_invalid_token(client, monkeypatch):
    from app.routers import auth as router_auth

    def _boom(_id_token: str):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="invalid")

    monkeypatch.setattr(router_auth, "verify_firebase_token", _boom)
    resp = client.post("/api/v1/auth/signin", json={"id_token": "bad"})
    assert resp.status_code == 401


def test_me_requires_token(client):
    resp = client.get("/api/v1/auth/users/me")
    assert resp.status_code == 401


def test_me_returns_current_user(client, fake_auth, auth_header):
    resp = client.get("/api/v1/auth/users/me", headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["id"] == "user-123"
