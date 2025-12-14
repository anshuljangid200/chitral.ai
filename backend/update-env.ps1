# Script to update MongoDB password in .env file
param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$envContent = @"
MONGO_URI=mongodb+srv://chitral:$Password@login.p5yvdtm.mongodb.net/event-ticketing
JWT_SECRET=your_jwt_secret_here_change_this_in_production
PORT=5000
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host "✅ .env file updated successfully!" -ForegroundColor Green
Write-Host "⚠️  Remember to update JWT_SECRET for production use" -ForegroundColor Yellow

