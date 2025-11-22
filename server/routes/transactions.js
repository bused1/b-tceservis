const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Tüm işlemleri getir
router.get('/', (req, res) => {
  const { startDate, endDate, type, categoryId } = req.query;
  const database = db.getDb();
  
  let query = `
    SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  const params = [req.user.userId];

  if (startDate) {
    query += ' AND t.date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND t.date <= ?';
    params.push(endDate);
  }
  if (type) {
    query += ' AND t.type = ?';
    params.push(type);
  }
  if (categoryId) {
    query += ' AND t.category_id = ?';
    params.push(categoryId);
  }

  query += ' ORDER BY t.date DESC, t.created_at DESC';

  database.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Belirli bir işlemi getir
router.get('/:id', (req, res) => {
  const database = db.getDb();
  database.get(
    `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
     FROM transactions t
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'İşlem bulunamadı' });
        return;
      }
      res.json(row);
    }
  );
});

// Yeni işlem oluştur
router.post('/', (req, res) => {
  const { category_id, amount, description, date, type } = req.body;
  
  if (!category_id || !amount || !date || !type) {
    res.status(400).json({ error: 'Kategori, tutar, tarih ve tip zorunludur' });
    return;
  }

  const database = db.getDb();
  const userId = req.user.userId;
  database.run(
    'INSERT INTO transactions (user_id, category_id, amount, description, date, type) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, category_id, amount, description || '', date, type],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        user_id: userId,
        category_id, 
        amount, 
        description, 
        date, 
        type 
      });
    }
  );
});

// İşlem güncelle
router.put('/:id', (req, res) => {
  const { category_id, amount, description, date, type } = req.body;
  const database = db.getDb();
  
  database.run(
    'UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ?, type = ? WHERE id = ?',
    [category_id, amount, description, date, type, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'İşlem bulunamadı' });
        return;
      }
      res.json({ id: req.params.id, category_id, amount, description, date, type });
    }
  );
});

// İşlem sil
router.delete('/:id', (req, res) => {
  const database = db.getDb();
  
  database.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'İşlem bulunamadı' });
      return;
    }
    res.json({ message: 'İşlem silindi' });
  });
});

module.exports = router;

