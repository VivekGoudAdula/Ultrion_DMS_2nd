"""
Application settings loaded from environment variables via pydantic-settings.
All config values are validated and typed at startup.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application configuration."""

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "ultrion_dms"

    # JWT
    JWT_SECRET: str = "bfI5WKHcKdyuLI4Id_VfXm-GO_YFXqyOuStF4-7jyXs" # Default for safety, should be overridden in env
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://ultrion-dms.vercel.app,https://dms-ultrion.vercel.app"

    # App metadata
    APP_NAME: str = "Ultrion DMS API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Singleton instance used across the app
settings = Settings()
