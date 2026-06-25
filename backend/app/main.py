from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, finance, ai, investments, goals
from app.db.session import engine
from app.db.base import Base

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Temporarily allow all for testing without credentials issue
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(finance.router, prefix="/api/finance", tags=["finance"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(investments.router, prefix="/api/investments", tags=["investments"])
app.include_router(goals.router, prefix="/api/goals", tags=["goals"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
