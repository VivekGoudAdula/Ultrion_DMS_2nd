"""
Application settings loaded from environment variables via pydantic-settings.
All config values are validated and typed at startup.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application configuration."""

    # MongoDB
    MONGO_URI: str = "mongodb://localhost:27017/mpl_steels_db"

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://ultrion-dms.vercel.app"

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
