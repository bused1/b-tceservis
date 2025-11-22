const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'butce-servis-secret-key-2024';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Erişim token\'ı bulunamadı' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }
    req.user = user;
    next();
  });
};

const getUserFromToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const database = db.getDb();
      
      database.get('SELECT id, email, name FROM users WHERE id = ?', [decoded.userId], (err, user) => {
        if (!err && user) {
          req.user = user;
        }
        next();
      });
    } catch (err) {
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
  getUserFromToken,
  JWT_SECRET
};

