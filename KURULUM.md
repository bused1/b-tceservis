# Projeyi Çalıştırma Talimatları

## 1. Adım: Node.js Kontrolü

Önce Node.js'in yüklü olduğundan emin olun. Terminal'de şu komutu çalıştırın:

```bash
node --version
npm --version
```

Eğer hata alırsanız, Node.js'i [nodejs.org](https://nodejs.org/) adresinden indirip yükleyin.

## 2. Adım: Bağımlılıkları Yükleme

Proje klasöründe (bütceservis klasöründe) terminal açın ve şu komutu çalıştırın:

```bash
npm run install-all
```

Bu komut:
- Ana klasördeki bağımlılıkları yükler
- Server klasöründeki bağımlılıkları yükler
- Client klasöründeki bağımlılıkları yükler

**Not:** Bu işlem birkaç dakika sürebilir.

## 3. Adım: Projeyi Çalıştırma

Bağımlılıklar yüklendikten sonra, projeyi çalıştırmak için:

```bash
npm run dev
```

Bu komut hem backend (port 5000) hem de frontend (port 3000) sunucularını başlatır.

## 4. Adım: Tarayıcıda Açma

Proje çalıştıktan sonra:

- **Frontend (Web Arayüzü)**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

Tarayıcınızda http://localhost:3000 adresine gidin.

## Alternatif: Ayrı Ayrı Çalıştırma

Eğer sunucuları ayrı ayrı çalıştırmak isterseniz:

### Backend'i başlatmak için:
```bash
npm run server
```

### Frontend'i başlatmak için (yeni bir terminal penceresinde):
```bash
npm run client
```

## Sorun Giderme

### Port zaten kullanılıyor hatası alırsanız:

**Port 5000 kullanılıyorsa:**
- `server/index.js` dosyasında `PORT` değişkenini değiştirebilirsiniz
- Veya o portu kullanan uygulamayı kapatın

**Port 3000 kullanılıyorsa:**
- React otomatik olarak 3001, 3002 gibi bir sonraki boş portu kullanacaktır

### Veritabanı hatası alırsanız:

- `server/database/` klasörünün var olduğundan emin olun
- İlk çalıştırmada veritabanı otomatik oluşturulacaktır

### Bağımlılık hataları:

Eğer bağımlılık yükleme sırasında hata alırsanız:

```bash
# Her klasörde ayrı ayrı deneyin
cd server
npm install
cd ../client
npm install
cd ..
npm install
```

## İlk Kullanım

1. Uygulama açıldığında Dashboard sayfasında olacaksınız
2. Varsayılan kategoriler otomatik oluşturulmuştur
3. "İşlemler" sayfasından gelir/gider ekleyebilirsiniz
4. "Kategoriler" sayfasından yeni kategoriler oluşturabilirsiniz
5. "Bütçe" sayfasından bütçe limitleri belirleyebilirsiniz

## Durdurma

Sunucuları durdurmak için terminal'de `Ctrl + C` tuşlarına basın.


