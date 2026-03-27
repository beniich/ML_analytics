#!/bin/bash

# ML Analytics API - Quick Start Script
# This script sets up and runs the application

set -e

echo "=================================="
echo "ML Analytics API - Quick Start"
echo "=================================="

# Check if Docker is available
if command -v docker-compose &> /dev/null; then
    echo ""
    echo "Docker Compose detected. Using containerized setup..."
    echo ""
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating .env file from template..."
        cp .env.example .env
        echo "✓ .env file created. Please review and update if needed."
    fi
    
    echo ""
    echo "Building and starting containers..."
    docker-compose up --build
else
    echo ""
    echo "Docker Compose not found. Using local Python setup..."
    echo ""
    
    # Check Python version
    python_version=$(python3 --version 2>&1 | awk '{print $2}')
    echo "Python version: $python_version"
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
        echo "✓ Virtual environment created"
    fi
    
    # Activate virtual environment
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    # Copy environment file
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cp .env.example .env
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    cd backend
    pip install -r requirements.txt
    echo "✓ Dependencies installed"
    
    # Initialize database
    echo ""
    echo "Initializing database..."
    python -c "from database import init_db; init_db(); print('✓ Database initialized')"
    
    # Start the API
    echo ""
    echo "Starting ML Analytics API..."
    echo "API Documentation: http://localhost:8000/api/docs"
    echo ""
    python main.py
fi
