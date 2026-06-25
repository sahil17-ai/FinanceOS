from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.investment import Investment
from app.schemas.finance import InvestmentCreate, Investment as InvestmentSchema
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[InvestmentSchema])
def read_investments(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve investments for the current user.
    """
    investments = db.query(Investment).filter(Investment.user_id == current_user.id).all()
    return investments

@router.post("/", response_model=InvestmentSchema)
def create_investment(
    investment: InvestmentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create a new investment for the current user.
    """
    db_investment = Investment(
        **investment.dict(),
        user_id=current_user.id
    )
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.delete("/{id}")
def delete_investment(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete an investment.
    """
    db_investment = db.query(Investment).filter(Investment.id == id, Investment.user_id == current_user.id).first()
    if not db_investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    
    db.delete(db_investment)
    db.commit()
    return {"ok": True}
