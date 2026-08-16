from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "MahaArogya - Sanjeevani Grid"
    API_V1_PREFIX: str = "/api/v1"

    # SQLite Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./mahaarogya.db"

    # AI Gateway
    AI_GATEWAY_URL: str = "http://localhost:8001"

    # JWT (demo only)
    JWT_SECRET: str = "mahaarogya-hackathon-demo-secret-2024"
    JWT_ALGORITHM: str = "HS256"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
