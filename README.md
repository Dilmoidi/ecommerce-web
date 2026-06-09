# ecommerce-web

A React-based e-commerce web application built with Vite.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Vitest** — Unit testing
- **React Testing Library** — Component testing
- **ESLint** — Linting

## Getting Started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

## Project Structure

```
src/
├── components/   # React UI components (ProductCard, SearchBar, CartSummary, Header)
├── context/      # React context providers (CartContext)
├── hooks/        # Custom hooks (useDebounce, useLocalStorage)
├── models/       # Data models (Product, User, Order)
├── services/     # API client and localStorage abstraction
└── utils/        # Pure utility functions (cart, formatters, validators, search)
```

## Lint

```bash
npm run lint
```
