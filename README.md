# Modüler Bütçe Servisi

Modern ve kullanıcı dostu bir bütçe yönetim web uygulaması. Gelir ve giderlerinizi kolayca takip edin, kategorilere göre organize edin ve bütçe limitlerinizi yönetin.

## Özellikler

- 📊 **Dashboard**: Gelir, gider ve bakiye özeti, kategorilere göre gider dağılımı grafikleri
- 💰 **İşlem Yönetimi**: Gelir ve gider işlemlerini ekleme, düzenleme ve silme
- 🏷️ **Kategori Yönetimi**: Özelleştirilebilir kategoriler (renk ve ikon seçimi)
- 📈 **Bütçe Limitleri**: Kategori bazında bütçe limitleri belirleme ve takip
- 📱 **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel görünüm
- 🎨 **Modern UI**: Tailwind CSS ile modern ve şık arayüz

## Teknolojiler

### Backend
- Node.js
- Express.js
- SQLite (Veritabanı)
- RESTful API

### Frontend
- React 18
- React Router
- Axios (API istekleri)
- Recharts (Grafikler)
- React Icons
- Tailwind CSS (CDN)

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın veya indirin**

2. **Tüm bağımlılıkları yükleyin**
   ```bash
   npm run install-all
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

   Bu komut hem backend (port 5000) hem de frontend (port 3001) sunucularını başlatır.

4. **Tarayıcıda açın**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000/api

## Proje Yapısı

```
butce-servis/
├── server/                 # Backend API
│   ├── database/          # Veritabanı dosyaları
│   ├── routes/            # API route'ları
│   │   ├── categories.js
│   │   ├── transactions.js
│   │   ├── budget.js
│   │   └── dashboard.js
│   ├── index.js           # Ana server dosyası
│   └── package.json
├── client/                # Frontend React uygulaması
│   ├── public/
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── services/      # API servisleri
│   │   └── App.js
│   └── package.json
├── package.json           # Ana package.json
└── README.md
```

## API Endpoints

### Kategoriler
- `GET /api/categories` - Tüm kategorileri getir
- `GET /api/categories/:id` - Belirli bir kategoriyi getir
- `POST /api/categories` - Yeni kategori oluştur
- `PUT /api/categories/:id` - Kategori güncelle
- `DELETE /api/categories/:id` - Kategori sil

### İşlemler
- `GET /api/transactions` - Tüm işlemleri getir (filtreleme parametreleri: type, categoryId, startDate, endDate)
- `GET /api/transactions/:id` - Belirli bir işlemi getir
- `POST /api/transactions` - Yeni işlem oluştur
- `PUT /api/transactions/:id` - İşlem güncelle
- `DELETE /api/transactions/:id` - İşlem sil

### Bütçe
- `GET /api/budget` - Tüm bütçe limitlerini getir
- `GET /api/budget/active` - Aktif bütçe limitlerini getir
- `POST /api/budget` - Yeni bütçe limiti oluştur
- `PUT /api/budget/:id` - Bütçe limiti güncelle
- `DELETE /api/budget/:id` - Bütçe limiti sil

### Dashboard
- `GET /api/dashboard/stats` - Dashboard istatistikleri (parametreler: startDate, endDate)

## Kullanım

1. **Kategoriler**: Önce gelir ve gider kategorilerinizi oluşturun
2. **İşlemler**: Gelir ve gider işlemlerinizi ekleyin
3. **Bütçe**: Kategorilere göre bütçe limitleri belirleyin
4. **Dashboard**: Genel durumu ve istatistikleri görüntüleyin

## Notlar

- Veritabanı otomatik olarak oluşturulur ve varsayılan kategoriler eklenir
- SQLite veritabanı dosyası `server/database/budget.db` konumunda oluşturulur
- Frontend için Tailwind CSS CDN üzerinden yüklenir (production için build sırasında optimize edilebilir)

## Lisans

MIT

