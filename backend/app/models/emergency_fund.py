from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime, timezone

class EmergencyFund(Base):
    __tablename__ = "emergency_funds"
    
    id = Column(Integer, primary_key=True, index=True)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
