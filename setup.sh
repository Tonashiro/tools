#!/bin/bash

# NFT Snapshoter Setup Script
echo "🚀 Setting up NFT Snapshoter..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from env.example..."
    cp env.example .env.local
    echo "✅ Created .env.local"
    echo "⚠️  Please edit .env.local with your actual API keys and secrets"
else
    echo "✅ .env.local already exists"
fi

# Start the database
echo "🐘 Starting PostgreSQL database..."
yarn docker:up

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is healthy
if docker-compose ps | grep -q "healthy"; then
    echo "✅ Database is healthy"
else
    echo "⚠️  Database might not be ready yet. Continuing anyway..."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
yarn db:generate

# Push schema to database
echo "📊 Setting up database schema..."
yarn db:push

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual API keys and secrets"
echo "2. Run 'yarn dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "- yarn docker:logs    # View database logs"
echo "- yarn docker:down    # Stop database"
echo "- yarn db:studio      # Open Prisma Studio"
echo "- yarn db:reset       # Reset database" 