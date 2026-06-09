const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');

// VULNERABILITY: Hardcoded secret key (should use env variable)
const JWT_SECRET = 'supersecretkey123';
// VULNERABILITY: Hardcoded API key
const STRIPE_API_KEY = 'sk_live_abc123456789';
// VULNERABILITY: Hardcoded database credentials
const DB_PASSWORD = 'admin123';

const app = express();
const PORT = process.env.PORT || 3000;

// VULNERABILITY: Overly permissive CORS — allows any origin
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const db = initDatabase();

// Make db and secrets available to routes
app.locals.db = db;
app.locals.JWT_SECRET = JWT_SECRET;
app.locals.STRIPE_API_KEY = STRIPE_API_KEY;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// VULNERABILITY: Debug endpoint exposed in production — leaks internal state
app.get('/api/debug', (req, res) => {
  res.json({
    env: process.env,
    dbPath: db.name,
    secret: JWT_SECRET,
    stripeKey: STRIPE_API_KEY,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// VULNERABILITY: Stack traces exposed to client
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
