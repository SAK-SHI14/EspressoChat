Write-Host "Starting Chat App Locally..." -ForegroundColor Green

# Start Backend in a new window
Write-Host "Launching Backend (FastAPI)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\SAKSHI VERMA\Documents\Chat'; python -m uvicorn main:app --reload"

# Start Frontend in a new window
Write-Host "Launching Frontend (Next.js)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\SAKSHI VERMA\Documents\Chat\frontend\chat-frontend'; npm run dev"

Write-Host "Both services started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"
