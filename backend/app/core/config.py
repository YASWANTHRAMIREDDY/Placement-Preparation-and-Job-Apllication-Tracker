import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Placement Preparation & Job Application Tracker"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretjwtkey_change_in_production_environment_with_strong_random_value"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database URL
    # Supports MySQL: mysql+pymysql://user:pass@host:3306/dbname
    # Supports SQLite fallback: sqlite:///./placement_tracker.db
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./placement_tracker.db"
    )

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
