from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime, timezone

class RecurringPayment(Base):
    __tablename__ = "recurring_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False) # e.g., Mutual Fund SIP, Education Loan EMI
    amount = Column(Float, nullable=False)
    day_of_month = Column(Integer, nullable=False)
    type = Column(String, nullable=False) # SIP, EMI, Bill
    is_active = Column(Integer, default=1) # 1 for active, 0 for paused
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
