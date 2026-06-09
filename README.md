# ecommerce-web

A Node.js/Express e-commerce web application with SQLite.

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | **Required.** Secret key for signing JWT tokens. Use a long random string. |
| `STRIPE_API_KEY` | Stripe API key for payment processing. |
| `PORT` | Server port (default: `3000`). |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins (default: `http://localhost:3000`). |

## API Endpoints

### Public
- `GET  /api/products` — List all products (filterable by `?category=`)
- `GET  /api/products/search?q=` — Search products

### Authenticated
- `POST /api/auth/login` — Login (returns JWT)
- `POST /api/auth/register` — Register new user
- `GET  /api/auth/profile/:id` — View own profile
- `POST /api/orders` — Place an order
- `GET  /api/orders/:id` — View own order

### Admin Only
- `GET    /api/orders` — List all orders
- `PUT    /api/orders/:id/status` — Update order status
- `POST   /api/products` — Create product
- `PUT    /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
- `GET    /api/admin/users` — List users
- `DELETE /api/admin/users/:id` — Delete user
- `PUT    /api/admin/users/:id/role` — Update user role
