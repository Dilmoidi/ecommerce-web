import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, truncateText, slugify } from '../formatters';

describe('formatPrice', () => {
  it('formats cents to dollar string', () => {
    expect(formatPrice(1999)).toBe('$19.99');
    expect(formatPrice(500)).toBe('$5.00');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(1)).toBe('$0.01');
  });

  it('handles negative values', () => {
    expect(formatPrice(-500)).toBe('$-5.00');
  });

  it('returns $0.00 for non-numeric input', () => {
    expect(formatPrice(null)).toBe('$0.00');
    expect(formatPrice(undefined)).toBe('$0.00');
    expect(formatPrice('abc')).toBe('$0.00');
    expect(formatPrice(NaN)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  it('formats ISO date strings', () => {
    expect(formatDate('2024-01-15T00:00:00Z')).toMatch(/Jan 15, 2024/);
  });

  it('returns empty string for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate('')).toBe('');
  });
});

describe('truncateText', () => {
  it('returns text unchanged if within limit', () => {
    expect(truncateText('short', 100)).toBe('short');
  });

  it('truncates text exceeding maxLength', () => {
    const result = truncateText('abcdefghij', 5);
    expect(result).toBe('abcde…');
    expect(result.length).toBeLessThanOrEqual(6);
  });

  it('handles non-string input', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(123)).toBe('');
  });

  it('uses default maxLength of 100', () => {
    const long = 'a'.repeat(150);
    expect(truncateText(long).length).toBeLessThanOrEqual(101);
  });
});

describe('slugify', () => {
  it('converts text to url-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Product Name!')).toBe('product-name');
    expect(slugify('  multiple   spaces  ')).toBe('multiple-spaces');
  });

  it('handles special characters', () => {
    expect(slugify('price: $19.99')).toBe('price-1999');
    expect(slugify('a--b')).toBe('a-b');
  });

  it('handles non-string input', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(42)).toBe('');
  });
});
