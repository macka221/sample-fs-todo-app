from __future__ import annotations

import logging
from typing import Annotated

import firebase_admin
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import credentials, auth as firebase_auth
from opentelemetry import trace
from sqlalchemy.orm import Session

from app.crud import get_or_create_user
from app.database import get_db
from app.config import settings
from app.observability import tracer

logger = logging.getLogger(__name__)

bearer_scheme = HTTPBearer(auto_error=False)

# Lazy, idempotent Firebase initialization. `firebase_admin.initialize_app` can only
# be called once per process, so we guard it. When no service account is configured
# the app still boots but rejects every authenticated request at runtime.
_firebase_app = None


def _ensure_firebase() -> None:
    """Initialize the Firebase Admin SDK on first use (no-op if already done)."""
    global _firebase_app
    if _firebase_app is not None:
        return
    if not settings.firebase_service_account_json:
        return  # no credentials configured; verification will always fail
    cred = credentials.Certificate(settings.firebase_service_account_json)
    _firebase_app = firebase_admin.initialize_app(
        cred,
        options={"projectId": settings.firebase_project_id}
        if settings.firebase_project_id
        else None,
    )


def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded claims.

    Wrapped so unit tests can monkeypatch it and run fully offline.
    """
    _ensure_firebase()
    with tracer.start_as_current_span("firebase.verify_id_token") as span:
        try:
            claims = firebase_auth.verify_id_token(id_token)
        except Exception as exc:  # noqa: BLE001 - any firebase error means invalid token
            logger.warning("Firebase token verification failed: %s", exc)
            span.record_exception(exc)
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Firebase token",
            ) from exc
        span.set_attribute("firebase.uid", claims.get("uid", ""))
        return claims


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
):
    """FastAPI dependency resolving the authenticated user from the Bearer token."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    claims = verify_firebase_token(credentials.credentials)
    uid = claims.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user id",
        )

    email = claims.get("email")
    return get_or_create_user(db, user_id=uid, email=email)
