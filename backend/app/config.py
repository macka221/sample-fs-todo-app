from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, sourced from environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Sample Todo API"
    api_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://app:app@localhost:5432/todo"

    # Firebase Admin SDK configuration.
    firebase_project_id: str = ""
    # Path to the Firebase service account JSON file (downloaded from console).
    firebase_service_account_json: str = ""

    # Security.
    firebase_id_token_audience: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
