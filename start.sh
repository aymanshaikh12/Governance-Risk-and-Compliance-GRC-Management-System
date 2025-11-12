#!/bin/bash

# GRC Compliance Management System Startup Script

echo "🚀 Starting GRC Compliance Management System..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   brew services start mongodb-community"
    echo ""
    echo "Continuing anyway... (you can start MongoDB later)"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/grc_compliance
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=3000
EOL
    echo "✅ Created .env file with default settings"
fi

# Ask if user wants to seed sample data
echo ""
read -p "🌱 Do you want to load sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Loading sample data..."
    node seedData.js
    echo "✅ Sample data loaded successfully!"
fi

echo ""
echo "🎯 Starting the application..."
echo "📍 Application will be available at: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the application"
echo ""

# Start the application
npm start
