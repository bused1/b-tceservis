# Kayıt Sorunu Çözümü

## Sorun
"Kayıt yapılamadı" hatası alıyorsunuz.

## Çözüm Adımları

### 1. Backend Paketlerini Yükleyin

Backend klasöründe yeni paketler (jsonwebtoken, bcryptjs) yüklenmeli:

```bash
cd server
npm install
```

### 2. Veritabanını Temizleyin (Önerilen)

Eski veritabanı yapısı yeni yapıyla uyumlu olmayabilir. Veritabanını silip yeniden oluşturun:

1. Backend'i durdurun (Ctrl+C)
2. `server/database/budget.db` dosyasını silin
3. Backend'i yeniden başlatın

### 3. Backend'i Yeniden Başlatın

```bash
cd server
npm run dev
```

"Server 5000 portunda çalışıyor" mesajını görmelisiniz.

### 4. Frontend'den Tekrar Deneyin

1. http://localhost:3001 adresine gidin
2. "Yeni hesap oluşturun" linkine tıklayın
3. Bilgilerinizi girin ve kayıt olun

## Hızlı Çözüm

`server` klasöründeki `YENIDEN-BASLAT.bat` dosyasına çift tıklayın. Bu:
- Paketleri yükler
- Backend'i başlatır

## Hata Devam Ederse

1. **Backend terminal'inde hata var mı kontrol edin**
   - Terminal'de kırmızı hata mesajları görüyor musunuz?

2. **Tarayıcı konsolunu kontrol edin**
   - F12 tuşuna basın
   - Console sekmesine gidin
   - Hata mesajlarını kontrol edin

3. **Network sekmesini kontrol edin**
   - F12 > Network sekmesi
   - Kayıt butonuna tıklayın
   - `/api/auth/register` isteğine bakın
   - Response'u kontrol edin

## Test

Backend çalışıyorsa şu adrese gidin:
http://localhost:5000/api/health

"Bütçe Servisi API çalışıyor" mesajını görmelisiniz.


