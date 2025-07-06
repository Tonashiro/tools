@echo off
REM NFT Snapshoter Setup Script for Windows

echo 🚀 Setting up NFT Snapshoter...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from env.example...
    copy env.example .env.local
    echo ✅ Created .env.local
    echo ⚠️  Please edit .env.local with your actual API keys and secrets
) else (
    echo ✅ .env.local already exists
)

REM Start the database
echo 🐘 Starting PostgreSQL database...
yarn docker:up

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Check if database is healthy
docker-compose ps | findstr "healthy" >nul
if errorlevel 1 (
    echo ⚠️  Database might not be ready yet. Continuing anyway...
) else (
    echo ✅ Database is healthy
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
yarn db:generate

REM Push schema to database
echo 📊 Setting up database schema...
yarn db:push

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your actual API keys and secrets
echo 2. Run 'yarn dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo Useful commands:
echo - yarn docker:logs    # View database logs
echo - yarn docker:down    # Stop database
echo - yarn db:studio      # Open Prisma Studio
echo - yarn db:reset       # Reset database
pause 