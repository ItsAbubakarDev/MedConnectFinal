# HealthCare Backend API

FastAPI backend for the HealthCare application with Supabase PostgreSQL database.

## Features

- User authentication (JWT-based)
- Role-based access control (Patient/Doctor)
- Secure password hashing
- RESTful API endpoints
- Supabase PostgreSQL database integration
- CORS enabled for frontend integration

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL (via Supabase)
- Virtual environment (recommended)

### Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
   - Get your Supabase URL and keys from the Supabase dashboard
   - Update DATABASE_URL with your Supabase connection string
   - Generate a secure SECRET_KEY for JWT tokens

### Running the Application

Development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info

## Database

The application uses Supabase PostgreSQL with the following tables:
- users
- patients
- doctors
- specializations
- appointments
- availability
- medical_records
- access_requests

All tables have Row Level Security (RLS) enabled for enhanced security.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Secure database connections
- CORS configured for frontend access

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
