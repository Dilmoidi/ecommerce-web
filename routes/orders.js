const express = require('express');
const router = express.Router();

// VULNERABILITY: No authentication — anyone can view all orders
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const orders = db.prepare('SELECT * FROM orders').all();
  res.json(orders);
});

// VULNERABILITY: No authentication — anyone can view any order by ID (IDOR)
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;

  // VULNERABILITY: SQL injection via URL parameter
  const order = db.prepare(`SELECT * FROM orders WHERE id = ${req.params.id}`).get();
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = db.prepare(`SELECT * FROM order_items WHERE order_id = ${req.params.id}`).all();
  res.json({ ...order, items });
});

// VULNERABILITY: No authentication to create orders
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { user_id, items, shipping_address } = req.body;

  // VULNERABILITY: No validation that user_id matches the authenticated user
  // VULNERABILITY: No validation on items array
  // VULNERABILITY: No stock check before placing order
  let total = 0;
  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  const result = db.prepare(
    'INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)'
  ).run(user_id, total, shipping_address);

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (product) {
      db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
      ).run(result.lastInsertRowid, item.product_id, item.quantity, product.price);
    }
  }

  res.status(201).json({ message: 'Order placed', orderId: result.lastInsertRowid, total });
});

// VULNERABILITY: No authentication to update order status
router.put('/:id/status', (req, res) => {
  const db = req.app.locals.db;
  const { status } = req.body;

  // VULNERABILITY: No validation on status value
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Order status updated' });
});

module.exports = router;
