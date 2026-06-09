const express = require('express');
const router = express.Router();

// Public route — list products
router.get('/', (req, res) => {
  const db = req.app.locals.db;

  // VULNERABILITY: SQL injection via query parameter
  const category = req.query.category;
  let products;
  if (category) {
    products = db.prepare(`SELECT * FROM products WHERE category = '${category}'`).all();
  } else {
    products = db.prepare('SELECT * FROM products').all();
  }

  res.json(products);
});

// VULNERABILITY: No authentication — anyone can search with SQL injection
router.get('/search', (req, res) => {
  const db = req.app.locals.db;
  const q = req.query.q;

  // VULNERABILITY: SQL injection via search query
  const products = db.prepare(`SELECT * FROM products WHERE name LIKE '%${q}%' OR description LIKE '%${q}%'`).all();
  res.json(products);
});

// VULNERABILITY: No authentication required to create products
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { name, description, price, stock, category, image_url } = req.body;

  // VULNERABILITY: No input validation — price could be negative, name could be XSS payload
  const result = db.prepare(
    'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, description, price, stock, category, image_url);

  res.status(201).json({ message: 'Product created', productId: result.lastInsertRowid });
});

// VULNERABILITY: No authentication required to update products
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { name, description, price, stock, category } = req.body;

  // VULNERABILITY: No validation on price (could be set to negative)
  db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ? WHERE id = ?'
  ).run(name, description, price, stock, category, req.params.id);

  res.json({ message: 'Product updated' });
});

// VULNERABILITY: No authentication required to delete products
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
