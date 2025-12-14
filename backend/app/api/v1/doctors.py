from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.doctor import Doctor
from app.models.specialization import Specialization
from app.schemas.doctor import DoctorResponse

router = APIRouter()


@router.get("/search", response_model=List[DoctorResponse])
def search_doctors(
    name: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor).join(User).join(Specialization, isouter=True)
    
    if name:
        search_pattern = f"%{name}%"
        query = query.filter(
            (User.first_name.ilike(search_pattern)) |
            (User.last_name.ilike(search_pattern))
        )
    
    if specialization:
        query = query.filter(Specialization.name.ilike(f"%{specialization}%"))
    
    doctors = query.all()
    
    result = []
    for doctor in doctors:
        result.append(DoctorResponse(
            id=doctor.id,
            user_id=doctor.user_id,
            specialization=doctor.specialization.name if doctor.specialization else None,
            license_number=doctor.license_number,
            bio=doctor.bio,
            phone=doctor.phone,
            consultation_fee=doctor.consultation_fee,
            years_of_experience=doctor.years_of_experience,
            first_name=doctor.user.first_name,
            last_name=doctor.user.last_name,
            created_at=doctor.created_at
        ))
    
    return result


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor_by_id(doctor_id: str, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    return DoctorResponse(
        id=doctor.id,
        user_id=doctor.user_id,
        specialization=doctor.specialization.name if doctor.specialization else None,
        license_number=doctor.license_number,
        bio=doctor.bio,
        phone=doctor.phone,
        consultation_fee=doctor.consultation_fee,
        years_of_experience=doctor.years_of_experience,
        first_name=doctor.user.first_name,
        last_name=doctor.user.last_name,
        created_at=doctor.created_at
    )
