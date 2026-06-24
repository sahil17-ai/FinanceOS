from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime, timezone

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, index=True, nullable=False) # e.g., Travel, Food, Family
    description = Column(String, nullable=True)
    date = Column(Date, nullable=False)
    notes = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
