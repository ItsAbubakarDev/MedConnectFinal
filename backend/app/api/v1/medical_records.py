from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.medical_record import MedicalRecord
from app.schemas.medical_record import MedicalRecordResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/my", response_model=List[MedicalRecordResponse])
def get_my_medical_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can access medical records"
        )
    
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        return []
    
    records = db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient.id
    ).order_by(MedicalRecord.date.desc()).all()
    
    result = []
    for record in records:
        result.append(MedicalRecordResponse(
            id=record.id,
            patient_id=record.patient_id,
            doctor_id=record.doctor_id,
            title=record.title,
            diagnosis=record.diagnosis,
            treatment=record.treatment,
            prescription=record.prescription,
            notes=record.notes,
            date=record.date,
            doctor_name=record.doctor.user.full_name,
            created_at=record.created_at
        ))
    
    return result
