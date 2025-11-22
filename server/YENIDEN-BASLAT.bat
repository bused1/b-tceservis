@echo off
echo ========================================
echo  BACKEND YENIDEN BASLATMA
echo ========================================
echo.
echo 1. Yeni paketler yukleniyor...
call npm install
echo.
echo 2. Backend baslatiliyor...
echo.
echo NOT: Eger hata alirsaniz, veritabani dosyasini silip yeniden baslatabilirsiniz:
echo server\database\budget.db dosyasini silin
echo.
call npm run dev
pause


