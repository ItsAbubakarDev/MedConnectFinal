from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str


class UserCreate(UserBase):
    password: str
    specialization: Optional[str] = None
    license_number: Optional[str] = None


class UserLogin(BaseModel):
    username: EmailStr
    password: str


class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: uuid.UUID
    email: str
    role: str
    name: str
    profile_picture: Optional[str] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[uuid.UUID] = None
    role: Optional[str] = None
