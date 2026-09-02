from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str | None = None


class SignInRequest(BaseModel):
    """Body for /auth/signin: a Firebase ID token minted by the client."""

    id_token: str = Field(description="Firebase ID token from the client's auth SDK")


class SignInResponse(BaseModel):
    access_token: str = Field(description="Firebase ID token echoed back for the client")
    token_type: str = "bearer"
    user: UserOut


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None


class TodoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    completed: bool | None = None


class TodoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None = None
    completed: bool
    owner_id: str
    created_at: datetime
    updated_at: datetime
