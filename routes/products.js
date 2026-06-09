const express = require('express');
const router = express.Router();
const { body, query, param, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');

// Public: list products (safe — parameterized query)
router.get('/', (req, res) => {
  const db = req.app.locals.db;

  const category = req.query.category;
  let products;
  if (category) {
    // FIX: Parameterized query
    products = db.prepare('SELECT * FROM products WHERE category = ?').all(category);
  } else {
    products = db.prepare('SELECT * FROM products').all();
  }

  res.json(products);
});

// Public: search products (safe — parameterized query)
router.get('/search', [
  query('q').isString().trim().notEmpty().isLength({ max: 100 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const q = req.query.q;

  // FIX: Parameterized LIKE query
  const products = db.prepare(
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?'
  ).all(`%${q}%`, `%${q}%`);

  res.json(products);
});

// FIX: Only authenticated admins can create products
router.post('/', authenticate, authorize('admin'), [
  body('name').isString().trim().notEmpty().isLength({ max: 200 }).escape(),
  body('description').optional().isString().trim().isLength({ max: 2000 }).escape(),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
  body('category').optional().isString().trim().escape(),
  body('image_url').optional().isURL()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const { name, description, price, stock, category, image_url } = req.body;

  const result = db.prepare(
    'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, description || null, price, stock, category || null, image_url || null);

  res.status(201).json({ message: 'Product created', productId: result.lastInsertRowid });
});

// FIX: Only authenticated admins can update products
router.put('/:id', authenticate, authorize('admin'), [
  param('id').isInt(),
  body('name').isString().trim().notEmpty().isLength({ max: 200 }).escape(),
  body('description').optional().isString().trim().isLength({ max: 2000 }).escape(),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
  body('category').optional().isString().trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const { name, description, price, stock, category } = req.body;

  db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ? WHERE id = ?'
  ).run(name, description || null, price, stock, category || null, req.params.id);

  res.json({ message: 'Product updated' });
});

// FIX: Only authenticated admins can delete products
router.delete('/:id', authenticate, authorize('admin'), [
  param('id').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
