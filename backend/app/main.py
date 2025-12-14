from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import auth, doctors, appointments, availability, medical_records

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_PREFIX}/auth",
    tags=["authentication"]
)

app.include_router(
    doctors.router,
    prefix=f"{settings.API_V1_PREFIX}/doctors",
    tags=["doctors"]
)

app.include_router(
    appointments.router,
    prefix=f"{settings.API_V1_PREFIX}/appointments",
    tags=["appointments"]
)

app.include_router(
    availability.router,
    prefix=f"{settings.API_V1_PREFIX}/availability",
    tags=["availability"]
)

app.include_router(
    medical_records.router,
    prefix=f"{settings.API_V1_PREFIX}/medical-records",
    tags=["medical-records"]
)


@app.get("/")
def read_root():
    return {"message": "Welcome to HealthCare API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
