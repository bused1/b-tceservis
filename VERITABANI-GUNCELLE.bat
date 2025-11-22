@echo off
echo ========================================
echo  VERITABANI GUNCELLEME
echo ========================================
echo.
echo NOT: Bu islem veritabani tablosuna user_id kolonu ekler.
echo Eger sorun devam ederse, budget.db dosyasini silip
echo backend'i yeniden baslatin.
echo.
cd server
node database/migrate.js
echo.
echo Migrasyon tamamlandi!
echo Backend'i yeniden baslatin.
pause


