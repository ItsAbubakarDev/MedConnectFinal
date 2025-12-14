from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
import uuid


class DoctorBase(BaseModel):
    specialization: Optional[str] = None
    license_number: str
    bio: Optional[str] = None
    phone: Optional[str] = None
    consultation_fee: Optional[Decimal] = None
    years_of_experience: Optional[int] = None


class DoctorCreate(DoctorBase):
    user_id: uuid.UUID
    specialization_id: Optional[int] = None


class DoctorUpdate(BaseModel):
    bio: Optional[str] = None
    phone: Optional[str] = None
    consultation_fee: Optional[Decimal] = None
    years_of_experience: Optional[int] = None


class DoctorResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    specialization: Optional[str] = None
    license_number: str
    bio: Optional[str] = None
    phone: Optional[str] = None
    consultation_fee: Optional[Decimal] = None
    years_of_experience: Optional[int] = None
    first_name: str
    last_name: str
    created_at: datetime

    class Config:
        from_attributes = True
