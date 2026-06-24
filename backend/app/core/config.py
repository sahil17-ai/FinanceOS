import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinanceOS"
    
    # SQLite Database URL
    DATABASE_URL: str = "sqlite:///./financeos.db"
    
    # Security
    SECRET_KEY: str = "super-secret-key-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Optional API Keys
    OPENAI_API_KEY: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
