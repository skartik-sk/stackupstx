#!/bin/bash

# StackUp Backend Deployment Script
echo "🚀 StackUp Backend Deployment Helper"
echo "======================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "📋 Checking requirements..."

if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Function to deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    if ! command_exists vercel; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "🔑 Make sure you have set these environment variables in Vercel:"
    echo "   - MONGODB_URI (your MongoDB connection string)"
    echo "   - CORS_ORIGIN (your frontend URL)"
    echo "   - NODE_ENV (set to 'production')"
    echo ""
    read -p "Have you set the environment variables? (y/n): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo "🚀 Deploying..."
        vercel --prod
    else
        echo "Please set environment variables first:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Select your project"
        echo "3. Go to Settings > Environment Variables"
        echo "4. Add the required variables"
        echo "5. Run this script again"
    fi
}

# Function to test locally
test_local() {
    echo "🧪 Testing backend locally..."
    
    # Start server in background
    echo "🔥 Starting development server..."
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    echo "🔍 Testing endpoints..."
    
    # Test health endpoint
    echo "Testing /health..."
    curl -s http://localhost:3001/health | jq . || echo "Health check failed"
    
    echo ""
    echo "Testing /api/bounties..."
    curl -s http://localhost:3001/api/bounties | jq . || echo "Bounties endpoint failed"
    
    echo ""
    echo "Testing /api/grants..."
    curl -s http://localhost:3001/api/grants | jq . || echo "Grants endpoint failed"
    
    echo ""
    echo "Testing /api/ideas..."
    curl -s http://localhost:3001/api/ideas | jq . || echo "Ideas endpoint failed"
    
    # Kill server
    kill $SERVER_PID
    echo "✅ Local testing complete"
}

# Function to setup environment
setup_env() {
    echo "⚙️  Setting up environment..."
    
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        cat > .env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/stackup

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development

# Server Configuration
PORT=3001
EOF
        echo "✅ .env file created with defaults"
        echo "📝 Please update .env with your actual MongoDB URI"
    else
        echo "✅ .env file already exists"
    fi
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1. Setup environment (.env file)"
echo "2. Test locally"
echo "3. Deploy to Vercel"
echo "4. Build for production"
echo "5. View deployment guide"
echo "6. Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        setup_env
        ;;
    2)
        test_local
        ;;
    3)
        deploy_vercel
        ;;
    4)
        echo "🔨 Building for production..."
        npm run build
        echo "✅ Build complete"
        ;;
    5)
        echo "📖 Opening deployment guide..."
        if command_exists code; then
            code DEPLOYMENT.md
        else
            cat DEPLOYMENT.md
        fi
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"
