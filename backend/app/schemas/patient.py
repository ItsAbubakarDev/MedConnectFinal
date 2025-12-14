from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import uuid


class PatientBase(BaseModel):
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None


class PatientCreate(PatientBase):
    user_id: uuid.UUID


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
