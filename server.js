require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// FIX: Read secrets from environment variables, fail fast if missing
const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set');
  process.exit(1);
}

// FIX: Use helmet for security headers
app.use(helmet());

// FIX: Restrict CORS to explicit allowed origins (configurable via env)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// FIX: Global rate limiter to mitigate brute-force / DDoS
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = initDatabase();

app.locals.db = db;
app.locals.JWT_SECRET = JWT_SECRET;
app.locals.STRIPE_API_KEY = STRIPE_API_KEY;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// FIX: Debug endpoint removed entirely.
// In development, use proper logging/monitoring tools instead.

// FIX: Error handler never exposes stack traces to clients
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
