from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime, timezone

class LendingRecord(Base):
    __tablename__ = "lending_records"
    
    id = Column(Integer, primary_key=True, index=True)
    person_name = Column(String, index=True, nullable=False)
    amount_lent = Column(Float, nullable=False)
    amount_recovered = Column(Float, default=0.0)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
