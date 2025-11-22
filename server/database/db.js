const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'budget.db');
let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
        reject(err);
      } else {
        console.log('SQLite veritabanına bağlandı');
        createTables().then(resolve).catch(reject);
      }
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Kullanıcılar tablosu (önce oluşturulmalı)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Kategoriler tablosu - önce eski tabloyu sil
      db.run(`DROP TABLE IF EXISTS categories`, (err) => {
        if (err) {
          console.error('Eski categories tablosu silinirken hata:', err);
        }
        
        // Yeni tabloyu oluştur
        db.run(`
          CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            color TEXT DEFAULT '#3B82F6',
            icon TEXT DEFAULT '💰',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `, (err) => {
          if (err) {
            console.error('Categories tablosu oluşturulurken hata:', err);
            reject(err);
            return;
          }
          
          // İşlemler tablosu
          db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              category_id INTEGER NOT NULL,
              amount REAL NOT NULL,
              description TEXT,
              date DATE NOT NULL,
              type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (category_id) REFERENCES categories(id)
            )
          `, (err) => {
            if (err) {
              console.error('Transactions tablosu oluşturulurken hata:', err);
              reject(err);
              return;
            }
            
            // Bütçe limitleri tablosu
            db.run(`
              CREATE TABLE IF NOT EXISTS budget_limits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                period TEXT NOT NULL CHECK(period IN ('daily', 'weekly', 'monthly', 'yearly')),
                start_date DATE NOT NULL,
                end_date DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
              )
            `, (err) => {
              if (err) {
                console.error('Budget limits tablosu oluşturulurken hata:', err);
                reject(err);
                return;
              }
              
              console.log('Tablolar oluşturuldu');
              // Tüm tablolar oluşturulduktan sonra varsayılan kategorileri ekle
              insertDefaultCategories();
              resolve();
            });
          });
        });
      });
    });
  });
};

const insertDefaultCategories = () => {
  const defaultCategories = [
    { name: 'Maaş', type: 'income', color: '#10B981', icon: '💼' },
    { name: 'Yatırım', type: 'income', color: '#10B981', icon: '📈' },
    { name: 'Diğer Gelir', type: 'income', color: '#10B981', icon: '💰' },
    { name: 'Yemek', type: 'expense', color: '#EF4444', icon: '🍔' },
    { name: 'Ulaşım', type: 'expense', color: '#EF4444', icon: '🚗' },
    { name: 'Faturalar', type: 'expense', color: '#EF4444', icon: '💡' },
    { name: 'Eğlence', type: 'expense', color: '#EF4444', icon: '🎬' },
    { name: 'Alışveriş', type: 'expense', color: '#EF4444', icon: '🛒' },
  ];

  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('Kategori kontrolü hatası:', err);
      return;
    }
    if (row && row.count === 0) {
      const stmt = db.prepare('INSERT INTO categories (name, type, color, icon, user_id) VALUES (?, ?, ?, ?, ?)');
      defaultCategories.forEach(cat => {
        stmt.run(cat.name, cat.type, cat.color, cat.icon, null); // user_id = null (genel kategoriler)
      });
      stmt.finalize();
      console.log('Varsayılan kategoriler eklendi');
    }
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Veritabanı başlatılmamış');
  }
  return db;
};

const close = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Veritabanı kapatma hatası:', err);
      } else {
        console.log('Veritabanı bağlantısı kapatıldı');
      }
    });
  }
};

module.exports = {
  init,
  getDb,
  close
};

