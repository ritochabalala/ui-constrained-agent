#!/bin/bash

# Start the React frontend server

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found. Please run setup.sh first."
    exit 1
fi

echo "Starting React frontend on http://localhost:3000"
npm start
