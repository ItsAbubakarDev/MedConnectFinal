from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
import uuid


class MedicalRecordBase(BaseModel):
    title: str
    diagnosis: str
    treatment: str
    prescription: Optional[str] = None
    notes: Optional[str] = None
    date: date


class MedicalRecordCreate(MedicalRecordBase):
    patient_id: uuid.UUID
    appointment_id: Optional[int] = None


class MedicalRecordUpdate(MedicalRecordBase):
    pass


class MedicalRecordResponse(MedicalRecordBase):
    id: int
    patient_id: uuid.UUID
    doctor_id: uuid.UUID
    doctor_name: str
    created_at: datetime

    class Config:
        from_attributes = True
