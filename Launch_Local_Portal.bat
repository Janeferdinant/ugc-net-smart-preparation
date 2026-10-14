@echo off
setlocal
cd /d "%~dp0"

echo =======================================================
echo   UGC NET Smart Preparation Portal - Local Deployment
echo =======================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "if (!(Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue)) { " ^
  "  Write-Host 'Starting backend server on port 8000...' -ForegroundColor Cyan; " ^
  "  Start-Process python -ArgumentList 'start_server.py' -WindowStyle Minimized; " ^
  "  Start-Sleep -Seconds 2; " ^
  "} else { " ^
  "  Write-Host 'Server is already active and running on port 8000.' -ForegroundColor Green; " ^
  "}"

echo.
echo Opening Portal in default browser...
start http://localhost:8000/

echo.
echo =======================================================
echo   Local Deployment Links:
echo   - Local Machine:  http://localhost:8000/
echo   - LAN / Wi-Fi:    http://172.16.0.105:8000/
echo   - API Health:     http://localhost:8000/api/health
echo =======================================================
echo.
pause
