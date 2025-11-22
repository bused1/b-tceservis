const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database/db');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const transactionsRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budget');
const dashboardRoutes = require('./routes/dashboard');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', authenticateToken, categoriesRoutes);
app.use('/api/transactions', authenticateToken, transactionsRoutes);
app.use('/api/budget', authenticateToken, budgetRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bütçe Servisi API çalışıyor' });
});

// Initialize database
db.init();

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

