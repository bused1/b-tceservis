@echo off
echo ========================================
echo  TAM TEMIZLIK VE YENIDEN YUKLEME
echo ========================================
echo.
echo 1. npm cache temizleniyor...
call npm cache clean --force
echo.
echo 2. node_modules siliniyor...
if exist node_modules rmdir /s /q node_modules
echo.
echo 3. package-lock.json siliniyor...
if exist package-lock.json del package-lock.json
echo.
echo 4. Bağımlılıklar yeniden yükleniyor (bu biraz zaman alabilir)...
call npm install
echo.
echo 5. Eksik paketler kontrol ediliyor...
call npm install binary-extensions --save-dev
echo.
echo ========================================
echo  TAMAMLANDI!
echo ========================================
echo.
echo Simdi 'npm start' komutunu calistirin.
pause

