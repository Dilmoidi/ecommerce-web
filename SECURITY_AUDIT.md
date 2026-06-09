# Security Audit Report — ecommerce-web

**Date:** 2026-06-09  
**Audited by:** Devin (automated scan + manual review)

---

## Summary

18 security issues identified across 6 files. All critical and high-severity issues have been fixed. The fixes are organized into a single commit with before/after traceability.

---

## Findings

### CRITICAL — Hardcoded Secrets (3 instances)

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| 1 | `server.js` | 7 | `JWT_SECRET = 'supersecretkey123'` hardcoded | Read from `process.env.JWT_SECRET`; fail fast if unset |
| 2 | `server.js` | 9 | `STRIPE_API_KEY = 'sk_live_abc123456789'` hardcoded | Read from `process.env.STRIPE_API_KEY` |
| 3 | `server.js` | 11 | `DB_PASSWORD = 'admin123'` hardcoded | Removed; use env var if needed |

### CRITICAL — SQL Injection (7 instances)

| # | File | Line | Vulnerable Query | Fix |
|---|------|------|-----------------|-----|
| 1 | `routes/auth.js` | 12 | `` `SELECT * FROM users WHERE username = '${username}'` `` | Parameterized: `WHERE username = ?` |
| 2 | `routes/auth.js` | 42 | `` `INSERT INTO users ... VALUES ('${username}', ...)` `` | Parameterized: `VALUES (?, ?, ?)` |
| 3 | `routes/auth.js` | 56 | `` `SELECT * FROM users WHERE id = ${req.params.id}` `` | Parameterized: `WHERE id = ?` |
| 4 | `routes/products.js` | 12 | `` `WHERE category = '${category}'` `` | Parameterized: `WHERE category = ?` |
| 5 | `routes/products.js` | 26 | `` `WHERE name LIKE '%${q}%'` `` | Parameterized: `WHERE name LIKE ?` |
| 6 | `routes/orders.js` | 16 | `` `WHERE id = ${req.params.id}` `` | Parameterized: `WHERE id = ?` |
| 7 | `routes/orders.js` | 21 | `` `WHERE order_id = ${req.params.id}` `` | Parameterized: `WHERE order_id = ?` |

### CRITICAL — Dangerous Endpoints

| # | File | Endpoint | Issue | Fix |
|---|------|----------|-------|-----|
| 1 | `server.js` | `GET /api/debug` | Exposes `process.env`, secrets, DB path | Removed entirely |
| 2 | `routes/admin.js` | `GET /api/admin/db-dump` | Full database dump with no auth | Removed entirely |
| 3 | `routes/admin.js` | `POST /api/admin/query` | Arbitrary SQL execution with no auth | Removed entirely |

### HIGH — Missing Authentication / Authorization

| # | File | Endpoint | Issue | Fix |
|---|------|----------|-------|-----|
| 1 | `routes/admin.js` | All admin routes | No auth middleware at all | Added `authenticate` + `authorize('admin')` router-level |
| 2 | `routes/products.js` | POST/PUT/DELETE | Anyone can create/edit/delete products | Added `authenticate` + `authorize('admin')` |
| 3 | `routes/orders.js` | GET `/` | Anyone can list all orders | Admin-only access |
| 4 | `routes/orders.js` | GET `/:id` | IDOR — anyone can view any order | Ownership check: `order.user_id === req.user.id` |
| 5 | `routes/orders.js` | POST `/` | `user_id` accepted from request body | Derived from JWT token instead |
| 6 | `routes/orders.js` | PUT `/:id/status` | Anyone can change order status | Admin-only access |
| 7 | `routes/auth.js` | GET `/profile/:id` | Anyone can view any user's profile | Auth required + ownership check |

### HIGH — Information Disclosure

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `server.js` | Error handler exposes `err.stack` to client | Generic "Internal server error" message |
| 2 | `routes/auth.js` | Registration error leaks `err.message` + `err.stack` | Generic message; unique-constraint → 409 |
| 3 | `routes/auth.js` | Login/profile return full user object including `password` hash | `stripPassword()` helper removes hash |
| 4 | `routes/admin.js` | `SELECT *` returns password hashes | Explicit column list excludes `password` |

### MEDIUM — Overly Permissive CORS

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `server.js` | `origin: '*'` with `credentials: true` | Origin whitelist via `ALLOWED_ORIGINS` env var |

### MEDIUM — Missing Input Validation

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `routes/auth.js` | No validation on login/register inputs | `express-validator` rules on all fields |
| 2 | `routes/products.js` | Price can be negative, no length limits | `isFloat({ min: 0.01 })`, `isLength()` |
| 3 | `routes/orders.js` | No validation on items array or status | Array/int validators + status enum |
| 4 | `routes/admin.js` | Role value not validated | `isIn(['customer', 'admin'])` |

### MEDIUM — Missing Rate Limiting / Security Headers

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `server.js` | No rate limiting anywhere | Global 100 req/15min + auth-specific 10 req/15min |
| 2 | `server.js` | No security headers | Added `helmet()` middleware |
| 3 | `routes/auth.js` | JWT tokens never expire | Added `{ expiresIn: '24h' }` |

### LOW — Missing Business Logic Validation

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `routes/orders.js` | No stock check before placing order | Validate stock + decrement in DB transaction |

---

## Dependencies

`npm audit` reports **0 known vulnerabilities** in the current dependency set.

---

## Recommendations for Future Work

1. Add CSRF protection for cookie-based sessions
2. Implement refresh token rotation
3. Add request logging / audit trail
4. Set up automated dependency scanning (Dependabot / Snyk)
5. Add Content-Security-Policy headers via helmet configuration
6. Consider using an ORM (e.g., Prisma) for additional SQL safety
7. Add automated security tests (e.g., OWASP ZAP integration)
