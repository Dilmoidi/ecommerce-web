import { describe, it, expect } from 'vitest';
import { filterProducts, sortProducts, paginateProducts } from '../search';

const products = [
  { id: '1', name: 'Blue Shirt', description: 'A nice shirt', price: 2000, category: 'clothing', stock: 10 },
  { id: '2', name: 'Red Pants', description: 'Casual pants', price: 3500, category: 'clothing', stock: 0 },
  { id: '3', name: 'Laptop Stand', description: 'Adjustable stand', price: 4999, category: 'electronics', stock: 5 },
  { id: '4', name: 'Headphones', description: 'Noise cancelling', price: 8999, category: 'electronics', stock: 20 },
];

describe('filterProducts', () => {
  it('filters by category', () => {
    const result = filterProducts(products, { category: 'electronics' });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === 'electronics')).toBe(true);
  });

  it('filters by price range', () => {
    const result = filterProducts(products, { minPrice: 3000, maxPrice: 5000 });
    expect(result).toHaveLength(2);
  });

  it('filters by stock availability', () => {
    const result = filterProducts(products, { inStock: true });
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.stock > 0)).toBe(true);
  });

  it('filters by search query matching name or description', () => {
    const result = filterProducts(products, { query: 'shirt' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines multiple filters', () => {
    const result = filterProducts(products, {
      category: 'electronics',
      minPrice: 5000,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('returns empty array for non-array input', () => {
    expect(filterProducts(null)).toEqual([]);
  });

  it('returns all products with no filters', () => {
    expect(filterProducts(products)).toHaveLength(4);
  });
});

describe('sortProducts', () => {
  it('sorts by name ascending', () => {
    const result = sortProducts(products, 'name', 'asc');
    expect(result[0].name).toBe('Blue Shirt');
    expect(result[3].name).toBe('Red Pants');
  });

  it('sorts by price descending', () => {
    const result = sortProducts(products, 'price', 'desc');
    expect(result[0].price).toBe(8999);
    expect(result[3].price).toBe(2000);
  });

  it('does not mutate original array', () => {
    const original = [...products];
    sortProducts(products, 'price', 'desc');
    expect(products).toEqual(original);
  });

  it('returns empty array for non-array', () => {
    expect(sortProducts(null)).toEqual([]);
  });
});

describe('paginateProducts', () => {
  it('returns first page of results', () => {
    const result = paginateProducts(products, 1, 2);
    expect(result.items).toHaveLength(2);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  it('returns second page of results', () => {
    const result = paginateProducts(products, 2, 2);
    expect(result.items).toHaveLength(2);
    expect(result.currentPage).toBe(2);
  });

  it('clamps page to valid range', () => {
    const result = paginateProducts(products, 99, 2);
    expect(result.currentPage).toBe(2);
  });

  it('handles non-array input', () => {
    const result = paginateProducts(null);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(0);
  });
});
