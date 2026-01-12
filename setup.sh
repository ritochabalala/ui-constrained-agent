#!/bin/bash

# Quick setup script for UI-Constrained Agent

set -e  # Exit on error

echo "========================================="
echo "UI-Constrained Agent - Quick Setup"
echo "========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Installing..."
    sudo apt update
    sudo apt install -y python3-venv python3-full
else
    echo "✅ Python3 found"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 14+ from https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js found: $(node --version)"
fi

echo ""
echo "========================================="
echo "Setting up Backend..."
echo "========================================="

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip > /dev/null 2>&1

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Run migrations
echo "Running database migrations..."
python manage.py migrate

echo "✅ Backend setup complete!"

cd ..

echo ""
echo "========================================="
echo "Setting up Frontend..."
echo "========================================="

cd frontend

# Install npm packages
echo "Installing Node dependencies (this may take a minute)..."
npm install > /dev/null 2>&1

echo "✅ Frontend setup complete!"

cd ..

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source .venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo "========================================="
