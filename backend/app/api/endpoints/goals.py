from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.goal import Goal
from app.schemas.finance import GoalCreate, Goal as GoalSchema
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[GoalSchema])
def read_goals(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve goals for the current user.
    """
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    return goals

@router.post("/", response_model=GoalSchema)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Create a new goal for the current user.
    """
    db_goal = Goal(
        **goal.dict(),
        user_id=current_user.id
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{id}")
def delete_goal(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Delete a goal.
    """
    db_goal = db.query(Goal).filter(Goal.id == id, Goal.user_id == current_user.id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(db_goal)
    db.commit()
    return {"ok": True}
