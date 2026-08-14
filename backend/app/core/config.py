from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://app_user:change_me@postgres:5432/expense_tracker"
    DATABASE_URL_SYNC: str = "postgresql+psycopg2://app_user:change_me@postgres:5432/expense_tracker"

    # JWT
    SECRET_KEY: str = "change_me_to_a_very_long_random_secret_key_at_least_32_chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.onrender.com",
        "https://*.vercel.app",
        "https://*.github.io",
    ]

    # Demo credentials
    DEMO_USER_EMAIL: str = "demo@example.com"
    DEMO_USER_PASSWORD: str = "Demo@12345"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_async_db_url(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgresql://") and "+asyncpg" not in v:
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            # asyncpg does not support sslmode=require in the connection string
            if "?sslmode=" in v:
                v = v.split("?sslmode=")[0]
        return v

    @field_validator("DATABASE_URL_SYNC", mode="before")
    @classmethod
    def assemble_sync_db_url(cls, v: str, info) -> str:
        # If DATABASE_URL_SYNC is not set explicitly, derive it from DATABASE_URL
        if not v or v == "postgresql+psycopg2://app_user:change_me@postgres:5432/expense_tracker":
            raw_url = info.data.get("DATABASE_URL", "")
            if raw_url:
                if "+asyncpg" in raw_url:
                    return raw_url.replace("+asyncpg", "+psycopg2")
                elif raw_url.startswith("postgres://"):
                    return raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+psycopg2://", 1)
        return v

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            if not v.startswith("["):
                return [i.strip() for i in v.split(",") if i.strip()]
            try:
                return json.loads(v)
            except Exception:
                return [v]
        return v

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
