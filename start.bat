@echo off
echo ===================================================
echo Starting FinanceOS...
echo ===================================================

echo Starting Backend API (FastAPI) on 0.0.0.0:8000...
start cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend Server (Vite) on Network...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening FinanceOS in your default browser...
start http://localhost:5173

echo ===================================================
echo FinanceOS is now running!
echo Do not close the black terminal windows.
echo To access on MOBILE, open this URL on your phone browser:
echo http://192.168.1.157:5173
echo ===================================================
pause
