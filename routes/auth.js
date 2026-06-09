const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// VULNERABILITY: No rate limiting on login — brute-force possible
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  // VULNERABILITY: SQL injection — string concatenation instead of parameterized query
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  const user = db.prepare(query).get();

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // VULNERABILITY: Token never expires
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    req.app.locals.JWT_SECRET
  );

  // VULNERABILITY: Returning password hash in response
  res.json({ token, user });
});

// VULNERABILITY: No input validation on registration
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const db = req.app.locals.db;

  // VULNERABILITY: SQL injection via string interpolation
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`
    ).run();
    res.status(201).json({ message: 'User registered', userId: result.lastInsertRowid });
  } catch (err) {
    // VULNERABILITY: Leaking internal error details
    res.status(400).json({ error: err.message, stack: err.stack });
  }
});

// VULNERABILITY: No authentication check — anyone can view any user's profile
router.get('/profile/:id', (req, res) => {
  const db = req.app.locals.db;

  // VULNERABILITY: SQL injection via URL parameter
  const user = db.prepare(`SELECT * FROM users WHERE id = ${req.params.id}`).get();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // VULNERABILITY: Returning password hash
  res.json(user);
});

module.exports = router;
