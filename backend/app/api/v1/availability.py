from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.models.doctor import Doctor
from app.models.availability import Availability
from app.api.deps import get_current_doctor
from pydantic import BaseModel, field_serializer
from datetime import time

router = APIRouter()


class AvailabilityCreate(BaseModel):
    day_of_week: str
    start_time: time
    end_time: time


class AvailabilityResponse(BaseModel):
    id: int
    doctor_id: UUID
    day_of_week: str
    start_time: time
    end_time: time
    is_available: bool

    @field_serializer('doctor_id')
    def serialize_doctor_id(self, doctor_id: UUID, _info):
        return str(doctor_id)

    class Config:
        from_attributes = True


@router.get("/my", response_model=List[AvailabilityResponse])
def get_my_availability(
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found"
        )
    
    availability_slots = db.query(Availability).filter(
        Availability.doctor_id == doctor.id
    ).order_by(Availability.day_of_week).all()
    
    return availability_slots


@router.post("", response_model=AvailabilityResponse, status_code=status.HTTP_201_CREATED)
def add_availability(
    availability_data: AvailabilityCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found"
        )
    
    if availability_data.start_time >= availability_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time"
        )
    
    new_availability = Availability(
        doctor_id=doctor.id,
        day_of_week=availability_data.day_of_week.lower(),
        start_time=availability_data.start_time,
        end_time=availability_data.end_time,
        is_available=True
    )
    
    db.add(new_availability)
    db.commit()
    db.refresh(new_availability)
    
    return new_availability


@router.delete("/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability(
    availability_id: int,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found"
        )
    
    availability = db.query(Availability).filter(
        Availability.id == availability_id,
        Availability.doctor_id == doctor.id
    ).first()
    
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability slot not found"
        )
    
    db.delete(availability)
    db.commit()
    
    return None
