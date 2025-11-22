const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Tüm bütçe limitlerini getir
router.get('/', (req, res) => {
  const database = db.getDb();
  const userId = req.user.userId;
  database.all(
    `SELECT bl.*, c.name as category_name, c.type as category_type, c.color as category_color
     FROM budget_limits bl
     JOIN categories c ON bl.category_id = c.id
     WHERE c.user_id = ? OR c.user_id IS NULL
     ORDER BY bl.start_date DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Aktif bütçe limitlerini getir
router.get('/active', (req, res) => {
  const database = db.getDb();
  const userId = req.user.userId;
  const today = new Date().toISOString().split('T')[0];
  
  database.all(
    `SELECT bl.*, c.name as category_name, c.type as category_type, c.color as category_color
     FROM budget_limits bl
     JOIN categories c ON bl.category_id = c.id
     WHERE (c.user_id = ? OR c.user_id IS NULL) AND bl.start_date <= ? AND (bl.end_date IS NULL OR bl.end_date >= ?)
     ORDER BY bl.start_date DESC`,
    [userId, today, today],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Bütçe limiti oluştur
router.post('/', (req, res) => {
  const { category_id, amount, period, start_date, end_date } = req.body;
  
  if (!category_id || !amount || !period || !start_date) {
    res.status(400).json({ error: 'Kategori, tutar, periyot ve başlangıç tarihi zorunludur' });
    return;
  }

  const database = db.getDb();
  database.run(
    'INSERT INTO budget_limits (category_id, amount, period, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
    [category_id, amount, period, start_date, end_date || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        category_id, 
        amount, 
        period, 
        start_date, 
        end_date 
      });
    }
  );
});

// Bütçe limiti güncelle
router.put('/:id', (req, res) => {
  const { category_id, amount, period, start_date, end_date } = req.body;
  const database = db.getDb();
  
  database.run(
    'UPDATE budget_limits SET category_id = ?, amount = ?, period = ?, start_date = ?, end_date = ? WHERE id = ?',
    [category_id, amount, period, start_date, end_date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Bütçe limiti bulunamadı' });
        return;
      }
      res.json({ id: req.params.id, category_id, amount, period, start_date, end_date });
    }
  );
});

// Bütçe limiti sil
router.delete('/:id', (req, res) => {
  const database = db.getDb();
  
  database.run('DELETE FROM budget_limits WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Bütçe limiti bulunamadı' });
      return;
    }
    res.json({ message: 'Bütçe limiti silindi' });
  });
});

module.exports = router;

