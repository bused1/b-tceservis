const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Dashboard istatistikleri
router.get('/stats', (req, res) => {
  const { startDate, endDate } = req.query;
  const database = db.getDb();
  
  const userId = req.user.userId;
  let dateFilter = '';
  const params = [userId];
  
  if (startDate && endDate) {
    dateFilter = 'WHERE t.user_id = ? AND t.date >= ? AND t.date <= ?';
    params.push(startDate, endDate);
  } else {
    // Varsayılan olarak bu ay
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    dateFilter = 'WHERE t.user_id = ? AND t.date >= ? AND t.date <= ?';
    params.push(firstDay, lastDay);
  }

  // Toplam gelir ve gider
  database.get(
    `SELECT 
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
     FROM transactions t ${dateFilter}`,
    params,
    (err, totals) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Kategori bazında giderler
      const categoryParams = [userId];
      let categoryDateFilter = '';
      if (startDate && endDate) {
        categoryDateFilter = 'AND t.date >= ? AND t.date <= ?';
        categoryParams.push(startDate, endDate);
      } else {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        categoryDateFilter = 'AND t.date >= ? AND t.date <= ?';
        categoryParams.push(firstDay, lastDay);
      }
      
      database.all(
        `SELECT 
          c.id,
          c.name,
          c.color,
          c.icon,
          COALESCE(SUM(t.amount), 0) as total
         FROM categories c
         LEFT JOIN transactions t ON c.id = t.category_id AND t.type = 'expense' AND t.user_id = ? ${categoryDateFilter}
         WHERE (c.user_id = ? OR c.user_id IS NULL) AND c.type = 'expense'
         GROUP BY c.id, c.name, c.color, c.icon
         ORDER BY total DESC`,
        [...categoryParams, userId],
        (err, expensesByCategory) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Son işlemler
          database.all(
            `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
             FROM transactions t
             JOIN categories c ON t.category_id = c.id
             ${dateFilter}
             ORDER BY t.date DESC, t.created_at DESC
             LIMIT 10`,
            params,
            (err, recentTransactions) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              const balance = totals.total_income - totals.total_expense;

              res.json({
                total_income: totals.total_income,
                total_expense: totals.total_expense,
                balance: balance,
                expenses_by_category: expensesByCategory,
                recent_transactions: recentTransactions
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;

