# MedConnect - Quick Start Guide

## Prerequisites
- Python 3.9+
- Node.js 16+
- Supabase database (already provisioned)

## Backend Setup (5 minutes)

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` and add your Supabase credentials:
```env
SECRET_KEY=healthcare-secret-key-2024-change-in-production
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

6. (Optional) Seed sample data:
```bash
python scripts/seed_data.py
```

7. Start backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend running at: http://localhost:8000
API docs at: http://localhost:8000/docs

## Frontend Setup (2 minutes)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend running at: http://localhost:5173

## Test Credentials (if you ran seed script)

**Patient Account:**
- Email: john.doe@example.com
- Password: patient123

**Doctor Account:**
- Email: dr.smith@example.com
- Password: doctor123

## Next Steps

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create a new account
3. Or use test credentials to login
4. Explore the application!

## Need Help?

See SETUP_GUIDE.md for detailed documentation.
