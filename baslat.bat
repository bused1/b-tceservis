@echo off
echo Bütce Servisi Baslatiliyor...
echo.
echo Backend sunucusu baslatiliyor (Port 5000)...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Frontend sunucusu baslatiliyor (Port 3001)...
start "Frontend Server" cmd /k "cd client && npm start"
echo.
echo Sunucular baslatildi!
echo.
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:3001
echo.
echo Sunuculari durdurmak icin pencereyi kapatin.
pause


