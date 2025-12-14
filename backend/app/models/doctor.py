from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialization_id = Column(Integer, ForeignKey("specializations.id"), nullable=True)
    license_number = Column(String, unique=True, nullable=False)
    bio = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    consultation_fee = Column(Numeric(10, 2), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="doctor")
    specialization = relationship("Specialization", back_populates="doctors")
    availability = relationship("Availability", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
    medical_records = relationship("MedicalRecord", back_populates="doctor")
