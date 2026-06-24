from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime, timezone

class Investment(Base):
    __tablename__ = "investments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, index=True, nullable=False) # Mutual Fund, Stock, Gold, etc.
    invested_amount = Column(Float, nullable=False, default=0.0)
    current_value = Column(Float, nullable=False, default=0.0)
    units = Column(Float, nullable=True)
    avg_price = Column(Float, nullable=True)
    sip_date = Column(Integer, nullable=True) # Day of the month
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
