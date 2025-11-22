@echo off
echo npm cache temizleniyor...
call npm cache clean --force
echo.
echo node_modules siliniyor...
if exist node_modules rmdir /s /q node_modules
echo package-lock.json siliniyor...
if exist package-lock.json del package-lock.json
echo.
echo Bağımlılıklar yeniden yükleniyor...
call npm install
echo.
echo Eksik paketler yükleniyor...
call npm install binary-extensions --save-dev
echo.
echo Tamamlandi! Simdi 'npm start' komutunu calistirin.
pause

