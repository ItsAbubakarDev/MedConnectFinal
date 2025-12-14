#!/bin/bash

echo "Starting HealthCare Backend API..."

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

if [ ! -f "venv/installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch venv/installed
fi

if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

echo "Starting Uvicorn server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
