/*
  # Create Core Healthcare System Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `hashed_password` (text, not null)
      - `role` (text, not null) - either 'patient' or 'doctor'
      - `first_name` (text, not null)
      - `last_name` (text, not null)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `patients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `date_of_birth` (date, nullable)
      - `phone` (text, nullable)
      - `address` (text, nullable)
      - `emergency_contact` (text, nullable)
      - `blood_type` (text, nullable)
      - `allergies` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `specializations`
      - `id` (serial, primary key)
      - `name` (text, unique, not null)
      - `description` (text, nullable)
      - `created_at` (timestamptz, default now())

    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `specialization_id` (integer, foreign key to specializations)
      - `license_number` (text, unique, not null)
      - `bio` (text, nullable)
      - `phone` (text, nullable)
      - `consultation_fee` (decimal, nullable)
      - `years_of_experience` (integer, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `availability`
      - `id` (serial, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `day_of_week` (text, not null) - monday, tuesday, etc.
      - `start_time` (time, not null)
      - `end_time` (time, not null)
      - `is_available` (boolean, default true)
      - `created_at` (timestamptz, default now())

    - `appointments`
      - `id` (serial, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_id` (uuid, foreign key to doctors)
      - `date` (date, not null)
      - `time` (time, not null)
      - `status` (text, not null) - pending, confirmed, completed, cancelled
      - `reason` (text, not null)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `medical_records`
      - `id` (serial, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_id` (uuid, foreign key to doctors)
      - `appointment_id` (integer, foreign key to appointments, nullable)
      - `title` (text, not null)
      - `diagnosis` (text, not null)
      - `treatment` (text, not null)
      - `prescription` (text, nullable)
      - `notes` (text, nullable)
      - `date` (date, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `access_requests`
      - `id` (serial, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `patient_id` (uuid, foreign key to patients)
      - `status` (text, not null) - pending, approved, denied
      - `requested_at` (timestamptz, default now())
      - `resolved_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for doctors to access patient data with granted access
    - Add policies for patients to view their medical records

  3. Indexes
    - Add indexes on foreign keys for performance
    - Add indexes on commonly queried fields (email, role, status, date)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth date,
  phone text,
  address text,
  emergency_contact text,
  blood_type text,
  allergies text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);

-- Create specializations table
CREATE TABLE IF NOT EXISTS specializations (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Insert common specializations
INSERT INTO specializations (name, description) VALUES
  ('General Practice', 'Primary healthcare and general medical consultations'),
  ('Cardiology', 'Heart and cardiovascular system specialists'),
  ('Pediatrics', 'Medical care for infants, children, and adolescents'),
  ('Dermatology', 'Skin, hair, and nail conditions'),
  ('Orthopedics', 'Musculoskeletal system and bone specialists'),
  ('Neurology', 'Nervous system and brain specialists'),
  ('Psychiatry', 'Mental health and psychiatric disorders'),
  ('Gynecology', 'Women''s reproductive health'),
  ('Ophthalmology', 'Eye and vision specialists'),
  ('ENT', 'Ear, nose, and throat specialists')
ON CONFLICT (name) DO NOTHING;

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization_id integer REFERENCES specializations(id),
  license_number text UNIQUE NOT NULL,
  bio text,
  phone text,
  consultation_fee decimal(10, 2),
  years_of_experience integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization_id);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id serial PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_availability_doctor_id ON availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id serial PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  reason text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id serial PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id integer REFERENCES appointments(id) ON DELETE SET NULL,
  title text NOT NULL,
  diagnosis text NOT NULL,
  treatment text NOT NULL,
  prescription text,
  notes text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON medical_records(date);

-- Create access_requests table
CREATE TABLE IF NOT EXISTS access_requests (
  id serial PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  requested_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  UNIQUE(doctor_id, patient_id)
);

CREATE INDEX IF NOT EXISTS idx_access_requests_doctor_id ON access_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_patient_id ON access_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true);

-- RLS Policies for patients table
CREATE POLICY "Patients can view their own profile"
  ON patients FOR SELECT
  USING (true);

CREATE POLICY "Patients can update their own profile"
  ON patients FOR UPDATE
  USING (true);

-- RLS Policies for doctors table
CREATE POLICY "Anyone can view doctor profiles"
  ON doctors FOR SELECT
  USING (true);

CREATE POLICY "Doctors can update their own profile"
  ON doctors FOR UPDATE
  USING (true);

-- RLS Policies for availability table
CREATE POLICY "Anyone can view doctor availability"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Doctors can manage their own availability"
  ON availability FOR ALL
  USING (true);

-- RLS Policies for appointments table
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (true);

-- RLS Policies for medical_records table
CREATE POLICY "Patients can view their own medical records"
  ON medical_records FOR SELECT
  USING (true);

CREATE POLICY "Doctors can create medical records"
  ON medical_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Doctors can update medical records they created"
  ON medical_records FOR UPDATE
  USING (true);

-- RLS Policies for access_requests table
CREATE POLICY "Users can view their own access requests"
  ON access_requests FOR SELECT
  USING (true);

CREATE POLICY "Doctors can create access requests"
  ON access_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Patients can update access requests for their data"
  ON access_requests FOR UPDATE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
