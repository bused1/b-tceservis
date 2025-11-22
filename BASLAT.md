# Projeyi Başlatma Rehberi

## Hızlı Başlatma (Windows)

### Yöntem 1: Otomatik Script (Önerilen)

Proje klasöründe `baslat.bat` dosyasına çift tıklayın. Bu dosya hem backend hem frontend'i otomatik başlatır.

### Yöntem 2: Manuel Başlatma

#### Adım 1: Backend'i Başlatın

1. Bir **PowerShell** veya **Command Prompt** penceresi açın
2. Proje klasörüne gidin:
   ```bash
   cd "C:\Users\bused\OneDrive\Masaüstü\bütceservis"
   ```
3. Backend'i başlatın:
   ```bash
   cd server
   npm run dev
   ```
4. "Server 5000 portunda çalışıyor" mesajını görmelisiniz

#### Adım 2: Frontend'i Başlatın (Yeni Pencere)

1. **Yeni bir** PowerShell veya Command Prompt penceresi açın
2. Proje klasörüne gidin:
   ```bash
   cd "C:\Users\bused\OneDrive\Masaüstü\bütceservis"
   ```
3. Frontend'i başlatın:
   ```bash
   cd client
   npm start
   ```
4. Tarayıcı otomatik açılacak veya http://localhost:3001 adresine gidin

## Kontrol

### Backend Kontrolü
Tarayıcıda şu adrese gidin:
- http://localhost:5000/api/health

Şu mesajı görmelisiniz:
```json
{"status":"OK","message":"Bütçe Servisi API çalışıyor"}
```

### Frontend Kontrolü
Tarayıcıda şu adrese gidin:
- http://localhost:3001

Web arayüzü açılmalı.

## Sorun Giderme

### "npm run dev" komutu çalışmıyor

Backend için:
```bash
cd server
node index.js
```

### "npm start" komutu çalışmıyor

Frontend için:
```bash
cd client
npm start
```

### Port zaten kullanılıyor

**Port 5000 kullanılıyorsa:**
- `server/index.js` dosyasını açın
- `const PORT = process.env.PORT || 5000;` satırını bulun
- `5000` yerine başka bir port (örn: `5001`) yazın

**Port 3001 kullanılıyorsa:**
- `client/package.json` dosyasını açın
- `"start": "set PORT=3001 && react-scripts start"` satırını bulun
- `3001` yerine başka bir port (örn: `3002`) yazın

### Bağımlılıklar yüklü değil

```bash
# Ana klasörde
npm install

# Server klasöründe
cd server
npm install

# Client klasöründe
cd ../client
npm install
```

## Sunucuları Durdurma

Her iki terminal penceresinde de `Ctrl + C` tuşlarına basın.


