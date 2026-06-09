const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');

// FIX: All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/users', (req, res) => {
  const db = req.app.locals.db;
  // FIX: Never return password hashes
  const users = db.prepare(
    'SELECT id, username, email, role, created_at FROM users'
  ).all();
  res.json(users);
});

router.delete('/users/:id', [
  param('id').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

const VALID_ROLES = ['customer', 'admin'];

router.put('/users/:id/role', [
  param('id').isInt(),
  body('role').isString().isIn(VALID_ROLES)
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(req.body.role, req.params.id);
  res.json({ message: 'User role updated' });
});

// FIX: db-dump and arbitrary SQL execution endpoints removed entirely.
// These are dangerous and should never exist in production.

module.exports = router;
