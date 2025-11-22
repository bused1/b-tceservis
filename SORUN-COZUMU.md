# Sorun Çözümü

## Hatalar:
1. ❌ ERR_CONNECTION_REFUSED - Backend çalışmıyor
2. ❌ 500 Internal Server Error - Dashboard SQL hatası

## Çözüm:

### 1. Backend'i Başlatın

**Yöntem 1: Otomatik Script**
- `BACKEND-BASLAT.bat` dosyasına çift tıklayın

**Yöntem 2: Manuel**
```powershell
cd server
npm install
npm run dev
```

"Server 5000 portunda çalışıyor" mesajını görmelisiniz.

### 2. Veritabanını Temizleyin (Önerilen)

Eski veritabanı yeni yapıyla uyumlu olmayabilir:

1. Backend'i durdurun (Ctrl+C)
2. `server/database/budget.db` dosyasını silin
3. Backend'i yeniden başlatın
4. Veritabanı otomatik olarak yeniden oluşturulacak

### 3. Kontrol Edin

Backend çalışıyorsa:
- http://localhost:5000/api/health adresine gidin
- "Bütçe Servisi API çalışıyor" mesajını görmelisiniz

### 4. Frontend'den Tekrar Deneyin

1. http://localhost:3001 adresine gidin
2. Kayıt olun veya giriş yapın
3. Dashboard açılmalı

## SQL Hatası Düzeltildi

Dashboard route'undaki SQL sorgusu düzeltildi. Backend'i yeniden başlattığınızda çalışacak.


