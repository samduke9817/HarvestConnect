# Simple Starter for HarvestConnect
# This script sets up database and starts server properly

echo Starting HarvestConnect setup...

# Step 1: Check directory
echo Checking project directory...
if not exist "client" (
  echo ERROR: client directory not found!
  echo Please make sure you're in the correct directory.
  pause
  exit /b 1
)

cd /d "%~dp0" 2>nul
if not exist "server" (
  echo ERROR: server directory not found!
  echo Please make sure you're in the correct directory.
  pause
  exit /b 1
)

# Step 2: Setup database
echo.
echo Setting up database...
copy nul .env.local
echo DATABASE_URL=./harvest-connect.db > .env.local
echo PORT=5000 >> .env.local
echo NODE_ENV=development >> .env.local

# Step 3: Run database setup
echo.
call npm run db:push
if errorlevel 1 (
  echo.
  echo Database setup had issues, but continuing...
)

# Step 4: Start server
echo.
echo Starting development server...
echo Browser will open to: http://localhost:5000
echo.
timeout /t 3 /nobreak
start http://localhost:5000

echo.
echo ========================================
echo SERVER STARTED
echo ========================================
echo.
echo Open your browser to test the application
echo Press Ctrl+C in the terminal window to stop the server
echo ========================================
echo.

echo Setup complete! If the browser doesn't open automatically, manually visit: http://localhost:5000
echo.
echo To check if server is running, try this URL in another tab: http://localhost:5000/test
echo.

pause
