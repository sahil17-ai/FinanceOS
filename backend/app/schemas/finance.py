from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Transactions
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime
    type: str # 'income' or 'expense'

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Lending
class LendingBase(BaseModel):
    person_name: str
    amount_lent: float
    amount_recovered: float = 0.0

class LendingCreate(LendingBase):
    pass

class LendingUpdate(BaseModel):
    amount_recovered: float

class Lending(LendingBase):
    id: int
    user_id: int
    date: datetime
    class Config:
        from_attributes = True

# Investments
class InvestmentBase(BaseModel):
    name: str # e.g. "SBI Multicap Fund Regular Growth", "GTL Infrastructure"
    type: str # 'sip' or 'stock'
    amount_invested: float
    current_value: float = 0.0
    units: Optional[float] = None
    avg_price: Optional[float] = None
    sip_date: Optional[int] = None # Day of month

class InvestmentCreate(InvestmentBase):
    pass

class Investment(InvestmentBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Goals
class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    linked_investment_id: Optional[int] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    current_amount: float

class Goal(GoalBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True
