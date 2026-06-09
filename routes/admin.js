const express = require('express');
const router = express.Router();

// VULNERABILITY: No authentication or authorization on admin routes

// Admin dashboard — lists all users including passwords
router.get('/users', (req, res) => {
  const db = req.app.locals.db;
  // VULNERABILITY: Returning password hashes for all users
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// VULNERABILITY: No admin check — anyone can delete users
router.delete('/users/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

// VULNERABILITY: No admin check — anyone can change user roles
router.put('/users/:id/role', (req, res) => {
  const db = req.app.locals.db;
  const { role } = req.body;
  // VULNERABILITY: No validation on role value
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ message: 'User role updated' });
});

// VULNERABILITY: Database dump endpoint with no auth
router.get('/db-dump', (req, res) => {
  const db = req.app.locals.db;
  const users = db.prepare('SELECT * FROM users').all();
  const products = db.prepare('SELECT * FROM products').all();
  const orders = db.prepare('SELECT * FROM orders').all();
  const orderItems = db.prepare('SELECT * FROM order_items').all();

  res.json({ users, products, orders, orderItems });
});

// VULNERABILITY: Execute arbitrary SQL
router.post('/query', (req, res) => {
  const db = req.app.locals.db;
  const { sql } = req.body;
  try {
    const result = db.prepare(sql).all();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
