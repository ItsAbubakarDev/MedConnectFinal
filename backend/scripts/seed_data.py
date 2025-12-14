import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.specialization import Specialization
from app.core.security import hash_password


def seed_database():
    db: Session = SessionLocal()
    
    try:
        print("Starting database seeding...")
        
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already has data. Skipping seed.")
            return
        
        print("Creating sample patients...")
        patient_password = hash_password("patient123")
        
        patient1_user = User(
            email="john.doe@example.com",
            hashed_password=patient_password,
            first_name="John",
            last_name="Doe",
            role="patient",
            is_active=True
        )
        db.add(patient1_user)
        db.flush()
        
        patient1 = Patient(
            user_id=patient1_user.id,
            phone="555-0101",
            blood_type="O+",
            allergies="None"
        )
        db.add(patient1)
        
        print("Creating sample doctors...")
        doctor_password = hash_password("doctor123")
        
        cardiology_spec = db.query(Specialization).filter(
            Specialization.name == "Cardiology"
        ).first()
        
        doctor1_user = User(
            email="dr.smith@example.com",
            hashed_password=doctor_password,
            first_name="Sarah",
            last_name="Smith",
            role="doctor",
            is_active=True
        )
        db.add(doctor1_user)
        db.flush()
        
        doctor1 = Doctor(
            user_id=doctor1_user.id,
            specialization_id=cardiology_spec.id if cardiology_spec else None,
            license_number="MD123456",
            bio="Experienced cardiologist with 15 years of practice",
            phone="555-0201",
            consultation_fee=150.00,
            years_of_experience=15
        )
        db.add(doctor1)
        
        pediatrics_spec = db.query(Specialization).filter(
            Specialization.name == "Pediatrics"
        ).first()
        
        doctor2_user = User(
            email="dr.johnson@example.com",
            hashed_password=doctor_password,
            first_name="Michael",
            last_name="Johnson",
            role="doctor",
            is_active=True
        )
        db.add(doctor2_user)
        db.flush()
        
        doctor2 = Doctor(
            user_id=doctor2_user.id,
            specialization_id=pediatrics_spec.id if pediatrics_spec else None,
            license_number="MD789012",
            bio="Pediatric specialist caring for children of all ages",
            phone="555-0202",
            consultation_fee=120.00,
            years_of_experience=10
        )
        db.add(doctor2)
        
        db.commit()
        print("Database seeding completed successfully!")
        print("\nTest Credentials:")
        print("Patient - Email: john.doe@example.com, Password: patient123")
        print("Doctor 1 - Email: dr.smith@example.com, Password: doctor123")
        print("Doctor 2 - Email: dr.johnson@example.com, Password: doctor123")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
