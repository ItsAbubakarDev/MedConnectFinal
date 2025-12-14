# MedConnect
Healthcare Management System - Web Semester Project

A full-stack healthcare management application with appointment booking, medical records, and doctor-patient interactions.

## Tech Stack

**Frontend:**
- React 19
- React Router for navigation
- Axios for API communication
- Modern CSS with responsive design

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL (via Supabase)
- JWT authentication
- Bcrypt password hashing

**Database:**
- Supabase PostgreSQL
- Row Level Security (RLS) enabled
- Automated migrations

## Features

### For Patients
- User registration and authentication
- Search and browse doctors by specialization
- Book appointments with doctors
- View appointment history
- Access medical records
- Manage profile information

### For Doctors
- Professional registration with license verification
- Manage availability schedule
- View and manage appointments
- Update appointment status
- Access patient information (with proper authorization)
- Profile management

### Security
- JWT-based authentication
- Secure password hashing (bcrypt)
- Role-based access control
- Row Level Security on database
- CORS protection
- Input validation

## Quick Start

See [QUICKSTART.md](QUICKSTART.md) for quick setup instructions.

For detailed setup, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Project Structure

```
MedConnect/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Security utilities
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── config.py    # Configuration
│   │   ├── database.py  # Database connection
│   │   └── main.py      # FastAPI app
│   ├── scripts/         # Utility scripts
│   ├── requirements.txt # Python dependencies
│   └── .env.example     # Environment template
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app
│   ├── package.json     # NPM dependencies
│   └── .env.example     # Environment template
│
├── QUICKSTART.md        # Quick setup guide
└── SETUP_GUIDE.md       # Detailed setup guide
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Schema

- `users` - User accounts (patients and doctors)
- `patients` - Patient profiles and medical info
- `doctors` - Doctor profiles and credentials
- `specializations` - Medical specializations
- `appointments` - Appointment bookings
- `availability` - Doctor availability schedules
- `medical_records` - Patient medical records
- `access_requests` - Record access management

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Testing

Test credentials (after running seed script):

**Patient:**
- Email: john.doe@example.com
- Password: patient123

**Doctor:**
- Email: dr.smith@example.com
- Password: doctor123

## License

MIT
