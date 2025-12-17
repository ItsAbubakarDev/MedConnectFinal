from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.specialization import Specialization
from app.schemas.user import UserCreate, UserResponse, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.config import settings
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if user_data.role == "doctor":
        if not user_data.license_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="License number is required for doctors"
            )
        
        existing_license = db.query(Doctor).filter(
            Doctor.license_number == user_data.license_number
        ).first()
        if existing_license:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="License number already registered"
            )
    
    hashed_pwd = hash_password(user_data.password)
    
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if user_data.role == "patient":
        new_patient = Patient(user_id=new_user.id)
        db.add(new_patient)
        db.commit()
    elif user_data.role == "doctor":
        specialization = None
        if user_data.specialization:
            specialization = db.query(Specialization).filter(
                Specialization.name.ilike(user_data.specialization)
            ).first()
            
            if not specialization:
                specialization = Specialization(
                    name=user_data.specialization,
                    description=f"{user_data.specialization} specialist"
                )
                db.add(specialization)
                db.commit()
                db.refresh(specialization)
        
        new_doctor = Doctor(
            user_id=new_user.id,
            license_number=user_data.license_number,
            specialization_id=specialization.id if specialization else None
        )
        db.add(new_doctor)
        db.commit()
    
    return new_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id), "role": user.role},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        name=user.full_name,
        profile_picture=user.profile_picture
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's profile with extended information"""
    profile_data = {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "profile_picture": current_user.profile_picture if hasattr(current_user, 'profile_picture') else None,
    }
    
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if patient:
            profile_data.update({
                "phone": patient.phone,
                "address": patient.address,
                "bio": patient.emergency_contact,  # Using emergency_contact as bio for now
            })
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if doctor:
            profile_data.update({
                "phone": doctor.phone,
                "bio": doctor.bio,
            })
    
    return profile_data


@router.put("/profile")
def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    # Update user table
    if "first_name" in profile_data:
        current_user.first_name = profile_data["first_name"]
    if "last_name" in profile_data:
        current_user.last_name = profile_data["last_name"]
    
    # Handle profile picture (stored as base64 string for simplicity)
    # In production, you would upload to cloud storage like S3 or Cloudinary
    if "profile_picture" in profile_data:
        if hasattr(current_user, 'profile_picture'):
            current_user.profile_picture = profile_data["profile_picture"]
    
    # Update role-specific data
    if current_user.role == "patient":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if patient:
            if "phone" in profile_data:
                patient.phone = profile_data["phone"]
            if "address" in profile_data:
                patient.address = profile_data["address"]
            if "bio" in profile_data:
                patient.emergency_contact = profile_data["bio"]
    elif current_user.role == "doctor":
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if doctor:
            if "phone" in profile_data:
                doctor.phone = profile_data["phone"]
            if "bio" in profile_data:
                doctor.bio = profile_data["bio"]
    
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully", "profile_picture": current_user.profile_picture if hasattr(current_user, 'profile_picture') else None}


@router.post("/change-password")
def change_password(
    password_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user's password"""
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")
    
    if not current_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password and new password are required"
        )
    
    # Verify current password
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Update password
    current_user.hashed_password = hash_password(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}
