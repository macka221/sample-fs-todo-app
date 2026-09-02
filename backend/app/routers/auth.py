from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth import get_current_user, verify_firebase_token
from app.crud import get_or_create_user
from app.database import get_db
from app.models import User
from app.schemas import SignInRequest, SignInResponse, UserOut
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signin",
    response_model=SignInResponse,
    summary="Authenticate with a Firebase ID token",
    description=(
        "Exchanges a Firebase ID token (minted by the client's Firebase SDK) for a "
        "local user record. The user is created on first sign-in. Returns the same "
        "token to be sent as `Authorization: Bearer <token>` on all protected routes."
    ),
)
def signin(payload: SignInRequest, db: Annotated[Session, Depends(get_db)]):
    claims = verify_firebase_token(payload.id_token)
    uid = claims.get("uid")
    email = claims.get("email")
    user = get_or_create_user(db, user_id=uid, email=email)
    return SignInResponse(access_token=payload.id_token, user=UserOut.model_validate(user))


@router.get(
    "/users/me",
    response_model=UserOut,
    summary="Get the current authenticated user",
    description="Returns the profile of the user identified by the Bearer token.",
)
def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    return UserOut.model_validate(current_user)
