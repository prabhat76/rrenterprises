#!/bin/bash

# RR Enterprises Billing Application - Quick Start Script

echo "================================"
echo "RR Enterprises Billing Application"
echo "Quick Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL client not found. Make sure PostgreSQL server is running."
else
    echo "✓ PostgreSQL is available"
fi

echo ""
echo "--- Backend Setup ---"
echo ""

# Backend setup
if [ -d "backend" ]; then
    cd backend
    
    echo "Installing backend dependencies..."
    npm install
    
    if [ ! -f ".env" ]; then
        echo ""
        echo "Creating .env file from example..."
        cp .env.example .env
        echo "⚠️  Please edit backend/.env with your database credentials"
        echo ""
        echo "Default configuration:"
        cat .env.example
        echo ""
    fi
    
    cd ..
else
    echo "Error: backend directory not found"
    exit 1
fi

echo ""
echo "--- Frontend Setup ---"
echo ""

# Frontend setup
if [ -d "frontend" ]; then
    cd frontend
    
    echo "Installing frontend dependencies..."
    npm install
    
    cd ..
else
    echo "Error: frontend directory not found"
    exit 1
fi

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Backend will run on: http://localhost:4000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "First Steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Create database: createdb roushan"
echo "3. Start both servers"
echo "4. Register admin user"
echo "5. Add sample data and test"
echo ""
echo "For detailed setup: see SETUP_GUIDE.md"
echo ""