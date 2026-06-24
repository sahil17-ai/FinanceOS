from fastapi import APIRouter
from app.api.endpoints import auth, users, transactions, investments, lending, goals, finance

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(investments.router, prefix="/investments", tags=["investments"])
api_router.include_router(lending.router, prefix="/lending", tags=["lending"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
# other routers will be included here
