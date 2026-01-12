#!/bin/bash

# Start the Django backend server

cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

source .venv/bin/activate

echo "Starting Django backend on http://localhost:8000"
python manage.py runserver
