# node_modules ve package-lock.json'ı temizle ve yeniden yükle
Write-Host "node_modules siliniyor..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

Write-Host "package-lock.json siliniyor..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

Write-Host "Bağımlılıklar yeniden yükleniyor..." -ForegroundColor Green
npm install

Write-Host "`nTamamlandı! Şimdi 'npm start' komutunu çalıştırın." -ForegroundColor Green


