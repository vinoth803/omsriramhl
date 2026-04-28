@echo off
echo ====================================
echo OmSaiRam HandLooms Setup Script
echo ====================================
echo.

:: Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

:: Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Update Razorpay keys in backend/.env
echo 2. Start backend: cd backend && npm run dev
echo 3. Start frontend: cd frontend && npm run dev
echo.
echo Your OmSaiRam HandLooms store will be available at:
echo http://localhost:3000
echo.
pause
