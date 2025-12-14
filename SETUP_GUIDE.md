# MedConnect - Complete Setup Guide

This guide will walk you through setting up the complete MedConnect application with Supabase authentication.

## Prerequisites

- Python 3.9+
- Node.js 16+
- Supabase account (database already provisioned)

## Backend Setup

### 1. Get Supabase Credentials

Your Supabase database is already provisioned. The credentials are available as environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (has admin access)
- `SUPABASE_DB_URL` - Direct PostgreSQL connection string

### 2. Configure Backend Environment

Create the `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your Supabase credentials. The file should look like:

```env
SECRET_KEY=your-secret-key-here-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:password@host:port/database

BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### 3. Install Backend Dependencies

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

### 4. Seed Sample Data (Optional)

```bash
python scripts/seed_data.py
```

This will create:
- Patient account: `john.doe@example.com` / `patient123`
- Doctor account: `dr.smith@example.com` / `doctor123`
- Doctor account: `dr.johnson@example.com` / `doctor123`

### 5. Start Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the startup script:
```bash
./start.sh
```

Backend will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Frontend Environment

The frontend already has the correct configuration in `.env.example`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Create `.env` from example:
```bash
cp .env.example .env
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Testing the Application

### 1. Register New Account

1. Navigate to `http://localhost:5173`
2. Click "Sign Up"
3. Fill in the registration form
4. Choose role (Patient or Doctor)
5. For doctors, enter specialization and license number

### 2. Login

1. Click "Sign In"
2. Enter email and password
3. You'll be redirected to the appropriate dashboard

### 3. Test Patient Features

- Search for doctors
- Book appointments
- View appointment history
- View medical records

### 4. Test Doctor Features

- View appointments
- Update appointment status
- Manage availability schedule

## Database Schema

The application uses the following tables:

- `users` - User accounts (patients and doctors)
- `patients` - Patient profiles
- `doctors` - Doctor profiles
- `specializations` - Medical specializations
- `appointments` - Appointment bookings
- `availability` - Doctor availability schedules
- `medical_records` - Patient medical records
- `access_requests` - Record access management

All tables have Row Level Security (RLS) enabled.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Doctors
- `GET /api/v1/doctors/search` - Search doctors
- `GET /api/v1/doctors/{id}` - Get doctor details

### Appointments
- `POST /api/v1/appointments` - Book appointment
- `GET /api/v1/appointments/my` - Get user's appointments
- `PATCH /api/v1/appointments/{id}/status` - Update appointment status

### Availability
- `GET /api/v1/availability/my` - Get doctor's availability
- `POST /api/v1/availability` - Add availability slot
- `DELETE /api/v1/availability/{id}` - Remove availability slot

### Medical Records
- `GET /api/v1/medical-records/my` - Get patient's medical records

## Troubleshooting

### Backend Issues

1. **Database Connection Error**
   - Verify Supabase credentials in `.env`
   - Check DATABASE_URL format
   - Ensure database migrations ran successfully

2. **Authentication Errors**
   - Verify SECRET_KEY is set
   - Check JWT token expiration settings
   - Clear browser local storage and re-login

3. **CORS Errors**
   - Verify BACKEND_CORS_ORIGINS includes frontend URL
   - Check that both servers are running

### Frontend Issues

1. **API Connection Failed**
   - Verify backend is running on port 8000
   - Check VITE_API_URL in frontend `.env`
   - Open browser console for detailed errors

2. **Authentication Not Working**
   - Clear browser local storage
   - Verify backend auth endpoints are working
   - Check network tab for API responses

## Security Notes

- Change SECRET_KEY in production
- Never commit .env files
- Use HTTPS in production
- Regularly rotate API keys
- Keep dependencies updated

## Development Tips

- Backend auto-reloads on code changes (--reload flag)
- Frontend hot-reloads automatically
- Use `/docs` endpoint to test API directly
- Check backend logs for detailed error messages
- Use browser DevTools Network tab to debug API calls

## Production Deployment

1. Set DEBUG=False in backend config
2. Use production database
3. Enable HTTPS
4. Set secure CORS origins
5. Use environment variables for secrets
6. Set up proper logging
7. Configure proper backup strategy

## Support

For issues or questions:
- Check API documentation at `/docs`
- Review error logs in terminal
- Verify environment variables are set correctly
