import { describe, it, expect } from 'vitest';
import { createProduct, isInStock, getDiscountedPrice, getAverageRating } from '../Product';

describe('createProduct', () => {
  it('creates a product with defaults', () => {
    const p = createProduct({ id: '1', name: 'Widget' });
    expect(p.id).toBe('1');
    expect(p.name).toBe('Widget');
    expect(p.price).toBe(0);
    expect(p.stock).toBe(0);
    expect(p.category).toBe('uncategorized');
    expect(p.createdAt).toBeDefined();
  });

  it('clamps negative price to 0', () => {
    const p = createProduct({ id: '1', name: 'Test', price: -500 });
    expect(p.price).toBe(0);
  });

  it('floors stock to integer', () => {
    const p = createProduct({ id: '1', name: 'Test', stock: 3.7 });
    expect(p.stock).toBe(3);
  });

  it('clamps rating between 0 and 5', () => {
    expect(createProduct({ id: '1', name: 'T', rating: -1 }).rating).toBe(0);
    expect(createProduct({ id: '1', name: 'T', rating: 10 }).rating).toBe(5);
    expect(createProduct({ id: '1', name: 'T', rating: 3.5 }).rating).toBe(3.5);
  });
});

describe('isInStock', () => {
  it('returns true when stock > 0', () => {
    expect(isInStock({ stock: 5 })).toBe(true);
  });

  it('returns false when stock is 0 or missing', () => {
    expect(isInStock({ stock: 0 })).toBe(false);
    expect(isInStock(null)).toBe(false);
    expect(isInStock({})).toBe(false);
  });
});

describe('getDiscountedPrice', () => {
  it('applies percentage discount', () => {
    expect(getDiscountedPrice({ price: 10000 }, 20)).toBe(8000);
  });

  it('clamps discount to 0-100', () => {
    expect(getDiscountedPrice({ price: 10000 }, -10)).toBe(10000);
    expect(getDiscountedPrice({ price: 10000 }, 150)).toBe(0);
  });

  it('returns 0 for null product', () => {
    expect(getDiscountedPrice(null, 20)).toBe(0);
  });
});

describe('getAverageRating', () => {
  it('calculates average', () => {
    const reviews = [{ rating: 4 }, { rating: 5 }, { rating: 3 }];
    expect(getAverageRating(reviews)).toBe(4);
  });

  it('rounds to one decimal', () => {
    const reviews = [{ rating: 4 }, { rating: 5 }];
    expect(getAverageRating(reviews)).toBe(4.5);
  });

  it('returns 0 for empty or invalid input', () => {
    expect(getAverageRating([])).toBe(0);
    expect(getAverageRating(null)).toBe(0);
  });
});
