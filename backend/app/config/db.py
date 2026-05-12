"""
Async MongoDB connection management using Motor.
Provides a globally accessible database instance and
lifecycle hooks for FastAPI startup/shutdown events.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Module-level references — populated on startup
_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """
    Open the MongoDB connection pool.
    Called during FastAPI's lifespan startup.
    """
    global _client, _db

    logger.info("Connecting to MongoDB...")
    try:
        # Use the updated setting name
        _client = AsyncIOMotorClient(settings.MONGODB_URI)
        
        # Explicitly select the database from settings
        _db = _client[settings.MONGODB_DB]

        # Verify connectivity with a lightweight ping
        # Note: Some CosmosDB instances require specific permissions for admin commands
        await _client.admin.command("ping")
        logger.info(f"MongoDB connection established to database: {settings.MONGODB_DB}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        # In a managed environment like Render, we might want to fail fast 
        # but with a clear error message in the logs.
        raise e


async def close_db() -> None:
    """
    Close the MongoDB connection pool.
    Called during FastAPI's lifespan shutdown.
    """
    global _client, _db

    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """
    Return the active database instance.
    Raises RuntimeError if called before connect_db().
    """
    if _db is None:
        raise RuntimeError(
            "Database not initialised. Ensure connect_db() ran during startup."
        )
    return _db
