const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Tüm kategorileri getir
router.get('/', (req, res) => {
  const database = db.getDb();
  const userId = req.user.userId;
  
  // Önce kullanıcının kategorilerini kontrol et
  database.all('SELECT * FROM categories WHERE user_id = ?', [userId], (err, userCategories) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Eğer kullanıcının hiç kategorisi yoksa, varsayılan kategorileri oluştur
    if (userCategories.length === 0) {
      insertDefaultCategoriesForUser(userId, database, (newCategories) => {
        res.json(newCategories);
      });
    } else {
      // Kullanıcının kategorileri var, onları döndür
      database.all('SELECT * FROM categories WHERE user_id = ? ORDER BY type, name', [userId], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  });
});

// Varsayılan kategorileri kullanıcı için oluştur (helper function)
const insertDefaultCategoriesForUser = (userId, database, callback) => {
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

  const stmt = database.prepare('INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)');
  defaultCategories.forEach(cat => {
    stmt.run(userId, cat.name, cat.type, cat.color, cat.icon);
  });
  stmt.finalize(() => {
    // Oluşturulan kategorileri getir
    database.all('SELECT * FROM categories WHERE user_id = ? ORDER BY type, name', [userId], (err, rows) => {
      if (err) {
        callback([]);
      } else {
        callback(rows);
      }
    });
  });
};

// Belirli bir kategoriyi getir
router.get('/:id', (req, res) => {
  const database = db.getDb();
  database.get('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Kategori bulunamadı' });
      return;
    }
    res.json(row);
  });
});

// Yeni kategori oluştur
router.post('/', (req, res) => {
  const { name, type, color, icon } = req.body;
  
  if (!name || !type) {
    res.status(400).json({ error: 'Kategori adı ve tipi zorunludur' });
    return;
  }

  const database = db.getDb();
  const userId = req.user.userId;
  database.run(
    'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)',
    [userId, name, type, color || '#3B82F6', icon || '💰'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, user_id: userId, name, type, color, icon });
    }
  );
});

// Kategori güncelle
router.put('/:id', (req, res) => {
  const { name, type, color, icon } = req.body;
  const database = db.getDb();
  
  database.run(
    'UPDATE categories SET name = ?, type = ?, color = ?, icon = ? WHERE id = ?',
    [name, type, color, icon, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Kategori bulunamadı' });
        return;
      }
      res.json({ id: req.params.id, name, type, color, icon });
    }
  );
});

// Kategori sil
router.delete('/:id', (req, res) => {
  const database = db.getDb();
  
  // Önce bu kategoriye ait işlemler var mı kontrol et
  database.get('SELECT COUNT(*) as count FROM transactions WHERE category_id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row.count > 0) {
      res.status(400).json({ error: 'Bu kategoriye ait işlemler olduğu için silinemez' });
      return;
    }

    database.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Kategori bulunamadı' });
        return;
      }
      res.json({ message: 'Kategori silindi' });
    });
  });
});

module.exports = router;

