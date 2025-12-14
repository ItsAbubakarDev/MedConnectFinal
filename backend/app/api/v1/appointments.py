from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def book_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book appointments"
        )
    
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )
    
    doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    new_appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        date=appointment_data.date,
        time=appointment_data.time,
        reason=appointment_data.reason,
        status="pending"
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return AppointmentResponse(
        id=new_appointment.id,
        patient_id=new_appointment.patient_id,
        doctor_id=new_appointment.doctor_id,
        date=new_appointment.date,
        time=new_appointment.time,
        status=new_appointment.status,
        reason=new_appointment.reason,
        notes=new_appointment.notes,
        patient_name=current_user.full_name,
        doctor_name=doctor.user.full_name,
        created_at=new_appointment.created_at
    )


@router.get("/my", response_model=List[AppointmentResponse])
def get_my_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == patient.id
        ).order_by(Appointment.date.desc(), Appointment.time.desc()).all()
        
        result = []
        for apt in appointments:
            result.append(AppointmentResponse(
                id=apt.id,
                patient_id=apt.patient_id,
                doctor_id=apt.doctor_id,
                date=apt.date,
                time=apt.time,
                status=apt.status,
                reason=apt.reason,
                notes=apt.notes,
                patient_name=current_user.full_name,
                doctor_name=apt.doctor.user.full_name,
                created_at=apt.created_at
            ))
        return result
    
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor:
            return []
        
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor.id
        ).order_by(Appointment.date.desc(), Appointment.time.desc()).all()
        
        result = []
        for apt in appointments:
            result.append(AppointmentResponse(
                id=apt.id,
                patient_id=apt.patient_id,
                doctor_id=apt.doctor_id,
                date=apt.date,
                time=apt.time,
                status=apt.status,
                reason=apt.reason,
                notes=apt.notes,
                patient_name=apt.patient.user.full_name,
                doctor_name=current_user.full_name,
                created_at=apt.created_at
            ))
        return result
    
    return []


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_update: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this appointment"
            )
    elif current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient or appointment.patient_id != patient.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this appointment"
            )
    
    if status_update.status:
        appointment.status = status_update.status
    if status_update.notes:
        appointment.notes = status_update.notes
    
    appointment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    
    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        date=appointment.date,
        time=appointment.time,
        status=appointment.status,
        reason=appointment.reason,
        notes=appointment.notes,
        patient_name=appointment.patient.user.full_name,
        doctor_name=appointment.doctor.user.full_name,
        created_at=appointment.created_at
    )
