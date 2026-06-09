const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

// FIX: Stricter rate limit on auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later' }
});

function stripPassword(user) {
  const { password, ...safe } = user;
  return safe;
}

router.post('/login', authLimiter, [
  body('username').isString().trim().notEmpty().escape(),
  body('password').isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = req.app.locals.db;

  // FIX: Parameterized query prevents SQL injection
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // FIX: Token expires in 24 hours
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    req.app.locals.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // FIX: Never return password hash
  res.json({ token, user: stripPassword(user) });
});

router.post('/register', authLimiter, [
  body('username').isString().trim().isLength({ min: 3, max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const db = req.app.locals.db;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    // FIX: Parameterized query prevents SQL injection
    const result = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username, email, hashedPassword);
    res.status(201).json({ message: 'User registered', userId: result.lastInsertRowid });
  } catch (err) {
    // FIX: Generic error message; no internal details leaked
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }
    res.status(400).json({ error: 'Registration failed' });
  }
});

// FIX: Authentication required; users can only view their own profile
router.get('/profile/:id', authenticate, [
  param('id').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const requestedId = parseInt(req.params.id, 10);

  // Users can only view their own profile; admins can view anyone's
  if (req.user.id !== requestedId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // FIX: Parameterized query
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(requestedId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // FIX: Never return password hash
  res.json(stripPassword(user));
});

module.exports = router;
