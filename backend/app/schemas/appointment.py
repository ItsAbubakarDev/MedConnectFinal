from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
import uuid


class AppointmentBase(BaseModel):
    date: date
    time: time
    reason: str


class AppointmentCreate(AppointmentBase):
    doctor_id: int


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: int
    patient_id: uuid.UUID
    doctor_id: uuid.UUID
    status: str
    notes: Optional[str] = None
    patient_name: str
    doctor_name: str
    created_at: datetime

    class Config:
        from_attributes = True
