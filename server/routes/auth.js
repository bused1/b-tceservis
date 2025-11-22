const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

// Kayıt
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, şifre ve isim zorunludur' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır' });
  }

  const database = db.getDb();

  // Email kontrolü
  database.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanılıyor' });
    }

    try {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);

      // Kullanıcıyı kaydet
      database.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Kullanıcı kaydedilemedi' });
          }

          // Token oluştur
          const token = jwt.sign(
            { userId: this.lastID, email },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.json({
            token,
            user: {
              id: this.lastID,
              email,
              name
            }
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
    }
  });
});

// Giriş
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre zorunludur' });
  }

  const database = db.getDb();

  database.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email veya şifre hatalı' });
      }

      // Token oluştur
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
    }
  });
});

// Kullanıcı bilgilerini getir
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }

    const database = db.getDb();
    database.get('SELECT id, email, name FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }
      res.json({ user });
    });
  });
});

module.exports = router;


