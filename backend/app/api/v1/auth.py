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
        name=user.full_name
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user
