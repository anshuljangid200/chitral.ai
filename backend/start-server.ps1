# Start Server Script
Write-Host "🚀 Starting Event Ticketing Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
MONGO_URI=mongodb+srv://chitral:<PASSWORD>@login.p5yvdtm.mongodb.net/event-ticketing
JWT_SECRET=your_jwt_secret_here_change_this_in_production
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
}

# Check if password needs to be updated
$envContent = Get-Content .env -Raw
if ($envContent -match '<PASSWORD>') {
    Write-Host "⚠️  WARNING: MongoDB password not set!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The .env file contains <PASSWORD> placeholder." -ForegroundColor Yellow
    Write-Host "Please update it with your actual MongoDB Atlas password." -ForegroundColor Yellow
    Write-Host ""
    $password = Read-Host "Enter your MongoDB Atlas password (or press Enter to continue anyway)"
    
    if ($password) {
        $envContent = $envContent -replace '<PASSWORD>', $password
        $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
        Write-Host "✅ Password updated!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Continuing with placeholder - connection will fail" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

node server.js

