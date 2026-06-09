import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
  applyDiscount,
  updateCartItem,
  addToCart,
  removeFromCart,
} from '../cart';

const sampleItems = [
  { id: '1', name: 'Shirt', price: 2000, quantity: 2 },
  { id: '2', name: 'Pants', price: 3500, quantity: 1 },
];

describe('calculateSubtotal', () => {
  it('sums price * quantity for all items', () => {
    expect(calculateSubtotal(sampleItems)).toBe(7500);
  });

  it('returns 0 for empty array', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('returns 0 for non-array', () => {
    expect(calculateSubtotal(null)).toBe(0);
    expect(calculateSubtotal('bad')).toBe(0);
  });

  it('handles items with missing values', () => {
    expect(calculateSubtotal([{ price: 100 }])).toBe(0);
    expect(calculateSubtotal([{ quantity: 2 }])).toBe(0);
  });
});

describe('calculateTax', () => {
  it('calculates tax at default 8%', () => {
    expect(calculateTax(10000)).toBe(800);
  });

  it('calculates tax at custom rate', () => {
    expect(calculateTax(10000, 0.1)).toBe(1000);
  });

  it('returns 0 for invalid input', () => {
    expect(calculateTax(-100)).toBe(0);
    expect(calculateTax('abc')).toBe(0);
  });
});

describe('calculateShipping', () => {
  it('returns standard rate for small orders', () => {
    expect(calculateShipping(1000)).toBe(499);
  });

  it('returns express rate', () => {
    expect(calculateShipping(1000, 'express')).toBe(999);
  });

  it('returns free shipping for orders >= $50', () => {
    expect(calculateShipping(5000)).toBe(0);
    expect(calculateShipping(10000)).toBe(0);
  });

  it('returns 0 for empty cart', () => {
    expect(calculateShipping(0)).toBe(0);
  });

  it('falls back to standard for unknown method', () => {
    expect(calculateShipping(1000, 'pigeon')).toBe(499);
  });
});

describe('calculateTotal', () => {
  it('returns full breakdown', () => {
    const result = calculateTotal(sampleItems);
    expect(result.subtotal).toBe(7500);
    expect(result.tax).toBe(600);
    expect(result.shipping).toBe(0); // over 5000
    expect(result.total).toBe(8100);
  });

  it('includes shipping for small orders', () => {
    const small = [{ id: '1', price: 500, quantity: 1 }];
    const result = calculateTotal(small);
    expect(result.shipping).toBe(499);
  });
});

describe('applyDiscount', () => {
  it('applies percentage discount', () => {
    expect(applyDiscount(10000, { type: 'percentage', value: 20 })).toBe(8000);
  });

  it('applies fixed discount', () => {
    expect(applyDiscount(10000, { type: 'fixed', value: 2000 })).toBe(8000);
  });

  it('does not go below 0 for fixed discount', () => {
    expect(applyDiscount(500, { type: 'fixed', value: 1000 })).toBe(0);
  });

  it('caps percentage at 100%', () => {
    expect(applyDiscount(10000, { type: 'percentage', value: 150 })).toBe(0);
  });

  it('returns subtotal for unknown type', () => {
    expect(applyDiscount(10000, { type: 'bogo', value: 50 })).toBe(10000);
  });

  it('returns subtotal when no coupon', () => {
    expect(applyDiscount(10000, null)).toBe(10000);
  });
});

describe('updateCartItem', () => {
  it('updates quantity of existing item', () => {
    const result = updateCartItem(sampleItems, '1', 5);
    expect(result.find((i) => i.id === '1').quantity).toBe(5);
  });

  it('removes item when quantity <= 0', () => {
    const result = updateCartItem(sampleItems, '1', 0);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns unchanged if id not found', () => {
    const result = updateCartItem(sampleItems, '999', 3);
    expect(result).toEqual(sampleItems);
  });

  it('returns empty array for non-array input', () => {
    expect(updateCartItem(null, '1', 1)).toEqual([]);
  });
});

describe('addToCart', () => {
  it('adds new product to cart', () => {
    const product = { id: '3', name: 'Hat', price: 1500 };
    const result = addToCart(sampleItems, product);
    expect(result).toHaveLength(3);
    expect(result[2]).toMatchObject({ id: '3', quantity: 1 });
  });

  it('increments quantity for existing product', () => {
    const product = { id: '1', name: 'Shirt', price: 2000 };
    const result = addToCart(sampleItems, product, 3);
    expect(result.find((i) => i.id === '1').quantity).toBe(5);
  });

  it('creates new cart from non-array', () => {
    const product = { id: '1', name: 'Shirt', price: 2000 };
    const result = addToCart(null, product);
    expect(result).toHaveLength(1);
  });
});

describe('removeFromCart', () => {
  it('removes item by id', () => {
    const result = removeFromCart(sampleItems, '1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns unchanged if id not found', () => {
    const result = removeFromCart(sampleItems, '999');
    expect(result).toHaveLength(2);
  });

  it('returns empty array for non-array input', () => {
    expect(removeFromCart(null, '1')).toEqual([]);
  });
});
