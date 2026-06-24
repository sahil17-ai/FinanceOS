from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas import user as schemas
from app.models import user as models

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_user)
):
    if user_in.salary_amount != None:
        current_user.salary_amount = user_in.salary_amount
    if user_in.salary_date != None:
        current_user.salary_date = user_in.salary_date
    if user_in.currency is not None:
        current_user.currency = user_in.currency
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
