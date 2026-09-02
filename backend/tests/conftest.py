from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import auth as auth_module
from app.routers import auth as router_auth
from app.database import Base, get_db
from app.main import app as fastapi_app

# In-memory SQLite keeps unit tests fully offline and sandboxed from Postgres.
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Token -> user mapping used by the fake Firebase verifier.
FAKE_USERS = {
    "token-student": {"uid": "user-123", "email": "student@example.com"},
    "token-other": {"uid": "user-456", "email": "other@example.com"},
}


def _fake_verify(id_token: str) -> dict:
    return FAKE_USERS.get(id_token, {"uid": "user-123", "email": "student@example.com"})


@pytest.fixture()
def fake_auth(monkeypatch):
    """Replace the Firebase verifier everywhere with a token-aware stand-in."""
    # get_current_user in app.auth calls app.auth.verify_firebase_token directly.
    # signin in router_auth holds its own imported reference.
    monkeypatch.setattr(auth_module, "verify_firebase_token", _fake_verify)
    monkeypatch.setattr(router_auth, "verify_firebase_token", _fake_verify)
    return FAKE_USERS


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def _override():
        yield db_session

    fastapi_app.dependency_overrides[get_db] = _override
    with TestClient(fastapi_app) as c:
        yield c
    fastapi_app.dependency_overrides.clear()


@pytest.fixture()
def auth_header():
    return {"Authorization": "Bearer token-student"}


@pytest.fixture()
def other_header():
    return {"Authorization": "Bearer token-other"}
