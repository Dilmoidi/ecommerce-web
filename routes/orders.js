const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');

// FIX: Only admins can list all orders
router.get('/', authenticate, authorize('admin'), (req, res) => {
  const db = req.app.locals.db;
  const orders = db.prepare('SELECT * FROM orders').all();
  res.json(orders);
});

// FIX: Auth required; users can only view their own orders, admins can view any
router.get('/:id', authenticate, [
  param('id').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const orderId = parseInt(req.params.id, 10);

  // FIX: Parameterized query
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // FIX: IDOR prevention — only owner or admin can access
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
  res.json({ ...order, items });
});

// FIX: Auth required; user_id derived from token, not request body
router.post('/', authenticate, [
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1, max: 100 }),
  body('shipping_address').isString().trim().notEmpty().isLength({ max: 500 }).escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  const { items, shipping_address } = req.body;
  const userId = req.user.id;

  // FIX: Validate products exist and have sufficient stock
  let total = 0;
  const resolvedItems = [];
  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.product_id} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    total += product.price * item.quantity;
    resolvedItems.push({ ...item, price: product.price });
  }

  const insertOrder = db.transaction(() => {
    const result = db.prepare(
      'INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)'
    ).run(userId, total, shipping_address);

    for (const item of resolvedItems) {
      db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
      ).run(result.lastInsertRowid, item.product_id, item.quantity, item.price);
      // FIX: Decrement stock
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
    }

    return result.lastInsertRowid;
  });

  const orderId = insertOrder();
  res.status(201).json({ message: 'Order placed', orderId, total });
});

// FIX: Only admins can update order status; validate status value
const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

router.put('/:id/status', authenticate, authorize('admin'), [
  param('id').isInt(),
  body('status').isString().isIn(VALID_STATUSES)
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.locals.db;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ message: 'Order status updated' });
});

module.exports = router;
