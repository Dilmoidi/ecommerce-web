import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getProductById, createProduct, login, register, placeOrder, getOrders } from '../api';

describe('api service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockFetch(data, ok = true, status = 200) {
    global.fetch = vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(data),
    });
  }

  describe('getProducts', () => {
    it('fetches products from /api/products', async () => {
      const data = [{ id: '1', name: 'Test' }];
      mockFetch(data);
      const result = await getProducts();
      expect(result).toEqual(data);
      expect(global.fetch).toHaveBeenCalledWith('/api/products', expect.any(Object));
    });

    it('appends query params', async () => {
      mockFetch([]);
      await getProducts({ category: 'shoes' });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/products?category=shoes',
        expect.any(Object),
      );
    });

    it('throws on API error', async () => {
      mockFetch(null, false, 500);
      await expect(getProducts()).rejects.toThrow('API error: 500');
    });
  });

  describe('getProductById', () => {
    it('fetches single product', async () => {
      const data = { id: '1', name: 'Test' };
      mockFetch(data);
      const result = await getProductById('1');
      expect(result).toEqual(data);
      expect(global.fetch).toHaveBeenCalledWith('/api/products/1', expect.any(Object));
    });
  });

  describe('createProduct', () => {
    it('sends POST request', async () => {
      const product = { name: 'New', price: 1000 };
      mockFetch({ id: '1', ...product });
      await createProduct(product);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/products',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('login', () => {
    it('posts credentials to /api/auth/login', async () => {
      mockFetch({ token: 'abc123' });
      const result = await login('a@b.com', 'pass');
      expect(result.token).toBe('abc123');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('register', () => {
    it('posts user data to /api/auth/register', async () => {
      mockFetch({ id: '1' });
      await register({ name: 'Alice', email: 'a@b.com', password: 'P4ssword' });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('placeOrder', () => {
    it('posts order to /api/orders', async () => {
      mockFetch({ id: 'o1' });
      await placeOrder({ items: [] });
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('getOrders', () => {
    it('fetches from /api/orders', async () => {
      mockFetch([]);
      await getOrders();
      expect(global.fetch).toHaveBeenCalledWith('/api/orders', expect.any(Object));
    });
  });
});
