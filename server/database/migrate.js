const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'budget.db');

const migrate = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
        reject(err);
        return;
      }

      console.log('Veritabanı migrasyonu başlatılıyor...');

      db.serialize(() => {
        // user_id kolonunu kontrol et ve ekle
        db.get("PRAGMA table_info(categories)", (err, rows) => {
          if (err) {
            console.error('Tablo bilgisi alınamadı:', err);
            db.close();
            reject(err);
            return;
          }

          // Tüm kolonları kontrol et
          db.all("PRAGMA table_info(categories)", (err, columns) => {
            if (err) {
              console.error('Kolon bilgisi alınamadı:', err);
              db.close();
              reject(err);
              return;
            }

            const hasUserId = columns.some(col => col.name === 'user_id');

            if (!hasUserId) {
              console.log('user_id kolonu ekleniyor...');
              db.run("ALTER TABLE categories ADD COLUMN user_id INTEGER", (err) => {
                if (err) {
                  console.error('Kolon eklenirken hata:', err);
                  db.close();
                  reject(err);
                  return;
                }
                console.log('user_id kolonu eklendi');
                db.close();
                resolve();
              });
            } else {
              console.log('user_id kolonu zaten mevcut');
              db.close();
              resolve();
            }
          });
        });
      });
    });
  });
};

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migrasyon tamamlandı!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migrasyon hatası:', err);
      process.exit(1);
    });
}

module.exports = { migrate };


